# Performance Profiling

## Initial Profiling (до оптимизаций)

**Инструменты:** React DevTools → Profiler

**Тестовые действия:**

1. Country search
2. Choose another year
3. Sorting by population
4. Add/remove a column
5. Filter by region

**Наблюдения:**

- Committed at: ~XXms sorting by population
- Render Duration: ~XXms sorting by population
- Committed at: ~XXms country search
- Render Duration: ~XXms country search
- Committed at: ~XXms change of year
- Render Duration: ~XXms change of year
- Committed at: ~XXm add/remove a column
- Render Duration: ~XXms add/remove a column
- Render Duration:
  - `LazyComponent`: ~XXms
  - `CountryList`: ~XXms
  - `CountryCard`: ~XXms
  - `CountryTable`: ~XXms
- Flame Graph показал, что при изменении года или сортировки перерендеривался **весь список стран**, даже если визуально ничего не менялось.
- Ranked Chart показал высокую нагрузку на `CountryCard`.

**Скриншоты:**

- Flame Graph (до)
- Ranked Chart (до)

---

## Optimizations

**Применённые техники:**

- `React.memo` для:
  - `CountryList`
  - `CountryCard`
  - `Controls`
  - `ColumnSelectorModal`
- `useMemo` для:
  - вычисления `headers`
  - выбора `latestRow`
  - списка доступных колонок
  - генерации `regionLabel`
  - фильтрованных/отсортированных `visibleCountries`
- `useCallback` для:
  - `onSearch`, `onSort`, `onYearChange`
  - `toggleRegion`
  - `runWorker` (обработчик Web Worker)
- Вынесена логика виртуализации таблиц для CountryTable (`useVirtualList`) → рендерятся только видимые строки таблицы.

---

## Profiling After Optimizations (после оптимизаций)

**Наблюдения:**

- Committed at: ~3.5ms when sorting by population
- Render Duration: ~6.8ms when sorting by population
- Committed at: ~4.6ms when country search
- Render Duration: ~7.4ms when country search
- Committed at: ~3.5ms change of year
- Render Duration: ~6.9ms change of year
- Committed at: ~2.7ms add/remove a column
- Render Duration: ~41.3ms add/remove a column
  Remove a column:
  - `LazyComponent`: ~2.4ms
  - `CountryList`: ~43.8ms
  - `CountryCard`: ~2ms
  - `CountryTable`: ~0.1ms
- Перерендериваются **только изменённые элементы**, а не весь список.
- Значительно уменьшилась нагрузка на `CountryCard`.

**Скриншоты:**

- Flame Graph (после)
- Ranked Chart (после)

---

## Вывод

После оптимизаций удалось:

- уменьшить commit duration и render duration,
- сократить количество ненужных ререндеров,
- улучшить отзывчивость интерфейса при сортировке, поиске и фильтрации.
