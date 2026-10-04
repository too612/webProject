package com.main.app.common.excel;

public interface ExcelDataProvider<T> {
    ExcelModel.Snapshot snapshot(T source);
}