import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const seed = read("../../docs/table/com_code_seed.sql");
const calendar = read("../../docs/table/cal_schema.sql");
const mapper = read("../../src/main/resources/mapper/official/news/eventcalendar/EventCalendarMapper.xml");
const member = read("../src/official/news/member/memberModel.ts");

test("admin code groups use distinct numbers under general administration", () => {
  assert.match(seed, /\('203', '출장구분', '010-200', '200'/);
  assert.match(seed, /\('201', '행사구분', '010-200', '200'/);
  assert.match(seed, /\('202', '성도소식구분', '010-200', '200'/);
  assert.doesNotMatch(seed, /\('201', '출장구분'/);
  for (const source of [seed]) {
    assert.doesNotMatch(source, /'401(?:-\d{3})?'|'010-400'/);
    for (const suffix of ["010", "020", "030", "040"]) {
      assert.match(source, new RegExp(`\\('201-${suffix}', '[^']+',\\s*'201', '200'`));
    }
  }
  for (const suffix of ["010", "020", "030", "040"]) {
    assert.ok(seed.includes(`'202-${suffix}'`));
    assert.ok(member.includes(`"202-${suffix}"`));
  }
  assert.doesNotMatch(member, /300-\d{3}/);
  assert.match(mapper, /WHERE parent_code = '201'/);
});

test("single seed preserves unique codes, parent references, column counts and category colors", () => {
  const codes = new Map();
  for (const source of [seed]) {
    for (const statement of source.matchAll(/INSERT INTO com_code \(([\s\S]*?)\) VALUES([\s\S]*?)ON CONFLICT/g)) {
      const columnCount = statement[1].split(",").length;
      for (const match of statement[2].matchAll(/\('(\d{3}(?:-\d{3})?)',([^\n]+)\)/g)) {
        const values = `${match[1]},${match[2]}`.split(",").map((value) => value.trim());
        assert.equal(values.length, columnCount, match[1]);
        const parent = values[2].replaceAll("'", "");
        assert.ok(!codes.has(match[1]), `duplicate code ${match[1]}`);
        codes.set(match[1], parent);
      }
    }
  }
  for (const [code, parent] of codes) assert.ok(codes.has(parent), `${code} parent ${parent}`);
  for (const [suffix, color] of [["010", "sky"], ["020", "green"], ["030", "orange"], ["040", "indigo"]]) {
    for (const source of [seed]) {
      assert.match(source, new RegExp(`\\('201-${suffix}', '[^']+',\\s*'201', '200', '${color}'`));
    }
  }
});

test("other SQL files do not register duplicate common codes", () => {
  assert.doesNotMatch(calendar, /INSERT INTO com_code/);
  assert.doesNotMatch(seed, /com_code_admin_migration/);
});
