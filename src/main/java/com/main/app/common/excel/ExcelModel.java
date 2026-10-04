package com.main.app.common.excel;

import java.util.List;
import java.util.Map;

public final class ExcelModel {
    private ExcelModel() {}
    public record Column(String id, String title, int width) {}
    public record Cell(String text, String fill, String imagePath, String imageHash, Double number) {
        public static Cell text(String text) { return new Cell(text == null ? "" : text, null, null, null, null); }
        public static Cell number(double number) {
            if (!Double.isFinite(number)) throw new IllegalArgumentException("엑셀 숫자가 올바르지 않습니다.");
            return new Cell(Double.toString(number), null, null, null, number);
        }
    }
    public record Row(Map<String, Cell> cells) {
        public Row { cells = Map.copyOf(cells); }
    }
    public record Snapshot(List<Column> columns, List<Row> rows, long totalCount) {
        public Snapshot {
            columns = List.copyOf(columns);
            rows = List.copyOf(rows);
            if (totalCount < rows.size()) throw new IllegalArgumentException("엑셀 조회 건수가 올바르지 않습니다.");
        }
    }
    public record Block(String token, List<Integer> indexes) {}
    public record Sheet(String name, List<Column> columns, List<Block> blocks) {}
    public record Request(String fileName, List<Sheet> sheets) {}
}