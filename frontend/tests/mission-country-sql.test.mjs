import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const ddl = read("../../docs/table/sys_country_code.sql");
const seed = read("../../docs/table/sys_country_code_seed.sql");
const restore = read("../../docs/table/sys_country_code_restore_fks.sql")
  .replace(/^BEGIN;|^COMMIT;/gm, "");
const mapperPaths = [
  "../../src/main/resources/mapper/official/training/outreach/OutreachMapper.xml",
  "../../src/main/resources/mapper/official/news/mission/MissionMapper.xml",
];
const queries = mapperPaths.map((path) => {
  const match = read(path).match(/<select id="getInfo"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(match);
  return match[1].replaceAll("&lt;", "<").replaceAll("&gt;", ">").trim();
});

test("every seeded country has one valid reference coordinate and both queries agree", () => {
  const [countries, coordinates] = seed.split("WITH coordinates");
  const codes = new Set([...countries.matchAll(/\('([A-Z]{2})',/g)].map((m) => m[1]));
  const rows = [...coordinates.matchAll(/\('([A-Z]{2})',\s*(-?[\d.]+),\s*(-?[\d.]+)\)/g)];
  assert.equal(codes.size, 200);
  assert.equal(rows.length, codes.size);
  assert.deepEqual(new Set(rows.map((m) => m[1])), codes);
  for (const [, code, lat, lon] of rows) {
    assert.ok(Number.isFinite(Number(lat)) && Math.abs(Number(lat)) <= 90, code);
    assert.ok(Number.isFinite(Number(lon)) && Math.abs(Number(lon)) <= 180, code);
  }
  assert.equal(queries[0], queries[1]);
  assert.match(ddl, /chk_country_map_coordinate_pair/);
  assert.match(seed, /CC BY 4.0/);
});

test("PostgreSQL executes country DDL, seeds, FK restoration and missionary query cases", {
  skip: !process.env.MISSION_SQL_TEST_PSQL && "Set MISSION_SQL_TEST_PSQL and PG* for a disposable PostgreSQL database",
}, () => {
  const query = queries[0];
  const check = (condition, label) =>
    `DO $$ BEGIN IF NOT (${condition}) THEN RAISE EXCEPTION '${label}'; END IF; END $$;`;
  const results = (assertions) => `
    CREATE TEMP TABLE actual AS ${query};
    ${assertions}
    DROP TABLE actual;
  `;
  const sql = `
    BEGIN;
    CREATE SCHEMA mission_country_test;
    SET LOCAL search_path = mission_country_test, public;
    ${ddl}
    ${seed}
    ${restore}
    ${check("(SELECT COUNT(*) = 200 FROM sys_country_code)", "Country count")}
    ${check("(SELECT COUNT(*) = 0 FROM sys_country_code WHERE map_latitude IS NULL OR map_longitude IS NULL)", "Missing coordinates")}
    ${read("../../docs/table/hrm_person.sql")}
    ${read("../../docs/table/hrm_assignment.sql")}
    ${read("../../docs/table/hrm_education.sql")}
    INSERT INTO hrm_person (person_key, employee_no, name_ko, service_status_code)
    SELECT lpad(n::TEXT, 80, '0'), lpad(n::TEXT, 6, '0'), 'Fixture ' || n, '101-010'
    FROM generate_series(98, 102) n;
    ${read("../../docs/table/hrm_assignment_seed.sql")}
    ${results(`
      ${check("(SELECT COUNT(*) = 5 FROM actual)", "Five seeded missionaries")}
      ${check("(SELECT COUNT(DISTINCT country_code) = 5 FROM actual)", "Five dispatch countries")}
      ${check("(SELECT latitude = 12.879721 AND longitude = 121.774017 AND city IS NULL AND region IS NULL FROM actual WHERE country_code = 'PH')", "Country reference point")}
    `)}
    INSERT INTO hrm_assignment (
      assignment_key, person_key, employee_no, assignment_date, assignment_type_code,
      grade_code, dispatch_country_code, reg_user, upd_user
    )
    SELECT lpad('latest', 80, '0'), person_key, employee_no, CURRENT_DATE, '105-030',
           '102-060', 'KR', 'TEST', 'TEST'
    FROM hrm_person WHERE employee_no = '000098';
    ${results(`
      ${check("(SELECT COUNT(*) = 5 FROM actual)", "Latest dispatch preserves people")}
      ${check("(SELECT country_code = 'KR' FROM actual WHERE employee_no = '000098')", "Latest per person")}
    `)}
    UPDATE sys_country_code SET map_latitude = NULL, map_longitude = NULL WHERE country_code = 'KR';
    ${results(`
      ${check("(SELECT COUNT(*) = 5 FROM actual)", "Missing coordinates preserve list")}
      ${check("(SELECT latitude IS NULL AND longitude IS NULL FROM actual WHERE country_code = 'KR')", "Null coordinate output")}
    `)}
    UPDATE sys_country_code SET use_yn = 'N' WHERE country_code = 'KR';
    ${results(check("(SELECT COUNT(*) = 4 FROM actual)", "Inactive latest country must not revive old dispatch"))}
    UPDATE sys_country_code SET use_yn = 'Y' WHERE country_code = 'KR';
    UPDATE hrm_assignment SET del_yn = 'Y' WHERE employee_no = '000099';
    UPDATE hrm_assignment SET assignment_date = CURRENT_DATE + 1 WHERE employee_no = '000100';
    UPDATE hrm_assignment SET assignment_end_date = CURRENT_DATE - 1 WHERE employee_no = '000101';
    UPDATE hrm_person SET service_status_code = '101-020' WHERE employee_no = '000102';
    ${results(check("(SELECT COUNT(*) = 1 FROM actual)", "Deleted future expired retired excluded"))}
    UPDATE hrm_person SET service_status_code = '101-010', retire_date = CURRENT_DATE WHERE employee_no = '000102';
    ${results(check("(SELECT COUNT(*) = 1 FROM actual)", "Retirement date excluded"))}
    UPDATE hrm_person SET retire_date = NULL WHERE employee_no = '000102';
    UPDATE hrm_assignment SET dispatch_country_code = 'KR', assignment_end_date = CURRENT_DATE WHERE employee_no = '000102';
    ${results(`
      ${check("(SELECT COUNT(*) = 2 FROM actual)", "End date inclusive")}
      ${check("(SELECT COUNT(*) = 2 FROM actual WHERE country_code = 'KR')", "Same country multiple people")}
    `)}
    INSERT INTO hrm_assignment (
      assignment_key, person_key, employee_no, assignment_date, assignment_type_code,
      grade_code, dispatch_country_code, reg_user, upd_user, reg_dtm
    )
    SELECT repeat('z', 80), person_key, employee_no, CURRENT_DATE, '105-030',
           '102-060', 'US', 'TEST', 'TEST', reg_dtm
    FROM hrm_assignment WHERE employee_no = '000098' AND dispatch_country_code = 'KR';
    ${results(check("(SELECT country_code = 'US' FROM actual WHERE employee_no = '000098')", "Deterministic same date tie break"))}
    DO $$ BEGIN
      BEGIN
        UPDATE sys_country_code SET map_latitude = 91, map_longitude = 0 WHERE country_code = 'KR';
        RAISE EXCEPTION 'Invalid latitude accepted';
      EXCEPTION WHEN check_violation THEN NULL; END;
      BEGIN
        UPDATE sys_country_code SET map_latitude = 0, map_longitude = 181 WHERE country_code = 'KR';
        RAISE EXCEPTION 'Invalid longitude accepted';
      EXCEPTION WHEN check_violation THEN NULL; END;
      BEGIN
        UPDATE sys_country_code SET map_latitude = 0, map_longitude = NULL WHERE country_code = 'KR';
        RAISE EXCEPTION 'Half coordinate accepted';
      EXCEPTION WHEN check_violation THEN NULL; END;
    END $$;
    INSERT INTO hrm_education (
      education_key, person_key, employee_no, school_type_code, school_name,
      country_code, reg_user, upd_user
    ) SELECT repeat('e', 80), person_key, employee_no, '110-010', 'Fixture', 'PH', 'TEST', 'TEST'
      FROM hrm_person WHERE employee_no = '000098';
    ${ddl}
    ${seed}
    ${restore}
    ${restore}
    ${check("(SELECT COUNT(*) = 2 FROM pg_constraint WHERE connamespace = 'mission_country_test'::regnamespace AND conname IN ('fk_hrm_assignment_dispatch_country_code', 'fk_hrm_education_country_code'))", "Country FKs restored")}
    ${check("(SELECT COUNT(*) = 1 FROM hrm_education)", "Education preserved after country recreation")}
    ${results(check("(SELECT COUNT(*) = 2 FROM actual)", "Assignments preserved after country recreation"))}
    ROLLBACK;
  `;
  const result = spawnSync(process.env.MISSION_SQL_TEST_PSQL,
    ["-X", "-v", "ON_ERROR_STOP=1", "-f", "-"],
    { input: sql, encoding: "utf8", timeout: 60000 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr);
});
