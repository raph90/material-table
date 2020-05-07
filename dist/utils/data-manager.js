"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _format = _interopRequireDefault(require("date-fns/format"));

var _filefy = require("filefy");

var _2 = require("./");

var DataManager = /*#__PURE__*/function () {
  // NOTE added these lines
  function DataManager() {
    var _this = this;

    (0, _classCallCheck2["default"])(this, DataManager);
    (0, _defineProperty2["default"])(this, "applyFilters", false);
    (0, _defineProperty2["default"])(this, "applySearch", false);
    (0, _defineProperty2["default"])(this, "currentPage", 0);
    (0, _defineProperty2["default"])(this, "detailPanelType", "multiple");
    (0, _defineProperty2["default"])(this, "lastDetailPanelRow", undefined);
    (0, _defineProperty2["default"])(this, "lastEditingRow", undefined);
    (0, _defineProperty2["default"])(this, "orderBy", -1);
    (0, _defineProperty2["default"])(this, "orderDirection", "");
    (0, _defineProperty2["default"])(this, "pageSize", 5);
    (0, _defineProperty2["default"])(this, "paging", true);
    (0, _defineProperty2["default"])(this, "parentFunc", null);
    (0, _defineProperty2["default"])(this, "searchText", "");
    (0, _defineProperty2["default"])(this, "selectedCount", 0);
    (0, _defineProperty2["default"])(this, "treefiedDataLength", 0);
    (0, _defineProperty2["default"])(this, "treeDataMaxLevel", 0);
    (0, _defineProperty2["default"])(this, "groupedDataLength", 0);
    (0, _defineProperty2["default"])(this, "defaultExpanded", false);
    (0, _defineProperty2["default"])(this, "exportAllData", true);
    (0, _defineProperty2["default"])(this, "exportFileName", "data");
    (0, _defineProperty2["default"])(this, "exportDelimeter", ",");
    (0, _defineProperty2["default"])(this, "data", []);
    (0, _defineProperty2["default"])(this, "columns", []);
    (0, _defineProperty2["default"])(this, "filteredData", []);
    (0, _defineProperty2["default"])(this, "searchedData", []);
    (0, _defineProperty2["default"])(this, "groupedData", []);
    (0, _defineProperty2["default"])(this, "treefiedData", []);
    (0, _defineProperty2["default"])(this, "sortedData", []);
    (0, _defineProperty2["default"])(this, "pagedData", []);
    (0, _defineProperty2["default"])(this, "renderData", []);
    (0, _defineProperty2["default"])(this, "filtered", false);
    (0, _defineProperty2["default"])(this, "searched", false);
    (0, _defineProperty2["default"])(this, "grouped", false);
    (0, _defineProperty2["default"])(this, "treefied", false);
    (0, _defineProperty2["default"])(this, "sorted", false);
    (0, _defineProperty2["default"])(this, "paged", false);
    (0, _defineProperty2["default"])(this, "rootGroupsIndex", {});
    (0, _defineProperty2["default"])(this, "expandTreeForNodes", function (data) {
      data.forEach(function (row) {
        var currentRow = row;

        while (_this.parentFunc(currentRow, _this.data)) {
          var parent = _this.parentFunc(currentRow, _this.data);

          if (parent) {
            parent.tableData.isTreeExpanded = true;
          }

          currentRow = parent;
        }
      });
    });
    (0, _defineProperty2["default"])(this, "findDataByPath", function (renderData, path) {
      if (_this.isDataType("tree")) {
        var node = path.reduce(function (result, current) {
          return result && result.tableData && result.tableData.childRows && result.tableData.childRows[current];
        }, {
          tableData: {
            childRows: renderData
          }
        });
        return node;
      } else {
        var data = {
          groups: renderData
        };

        var _node = path.reduce(function (result, current) {
          if (result.groups.length > 0) {
            return result.groups[current];
          } else if (result.data) {
            return result.data[current];
          } else {
            return undefined;
          }
        }, data);

        return _node;
      }
    });
    (0, _defineProperty2["default"])(this, "getFieldValue", function (rowData, columnDef) {
      var lookup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var value = typeof rowData[columnDef.field] !== "undefined" ? rowData[columnDef.field] : (0, _2.byString)(rowData, columnDef.field);

      if (columnDef.lookup && lookup) {
        value = columnDef.lookup[value];
      }

      return value;
    });
    (0, _defineProperty2["default"])(this, "getRenderState", function () {
      if (_this.filtered === false) {
        _this.filterData();
      }

      if (_this.searched === false) {
        _this.searchData();
      }

      if (_this.grouped === false && _this.isDataType("group")) {
        _this.groupData();
      }

      if (_this.treefied === false && _this.isDataType("tree")) {
        _this.treefyData();
      }

      if (_this.sorted === false) {
        _this.sortData();
      }

      if (_this.paged === false) {
        _this.pageData();
      }

      return {
        columns: _this.columns,
        currentPage: _this.currentPage,
        data: _this.sortedData,
        lastEditingRow: _this.lastEditingRow,
        orderBy: _this.orderBy,
        orderDirection: _this.orderDirection,
        originalData: _this.data,
        pageSize: _this.pageSize,
        renderData: _this.pagedData,
        searchText: _this.searchText,
        selectedCount: _this.selectedCount,
        treefiedDataLength: _this.treefiedDataLength,
        treeDataMaxLevel: _this.treeDataMaxLevel,
        groupedDataLength: _this.groupedDataLength
      };
    });
    (0, _defineProperty2["default"])(this, "filterData", function () {
      _this.searched = _this.grouped = _this.treefied = _this.sorted = _this.paged = false;
      _this.filteredData = (0, _toConsumableArray2["default"])(_this.data);

      if (_this.applyFilters) {
        _this.columns.filter(function (columnDef) {
          return columnDef.tableData.filterValue;
        }).forEach(function (columnDef) {
          var lookup = columnDef.lookup,
              type = columnDef.type,
              tableData = columnDef.tableData;

          if (columnDef.customFilterAndSearch) {
            _this.filteredData = _this.filteredData.filter(function (row) {
              return !!columnDef.customFilterAndSearch(tableData.filterValue, row, columnDef);
            });
          } else {
            if (lookup) {
              _this.filteredData = _this.filteredData.filter(function (row) {
                var value = _this.getFieldValue(row, columnDef, false);

                return !tableData.filterValue || tableData.filterValue.length === 0 || tableData.filterValue.indexOf(value !== undefined && value !== null && value.toString()) > -1;
              });
            } else if (type === "numeric") {
              _this.filteredData = _this.filteredData.filter(function (row) {
                var value = _this.getFieldValue(row, columnDef);

                return value + "" === tableData.filterValue;
              });
            } else if (type === "boolean" && tableData.filterValue) {
              _this.filteredData = _this.filteredData.filter(function (row) {
                var value = _this.getFieldValue(row, columnDef);

                return value && tableData.filterValue === "checked" || !value && tableData.filterValue === "unchecked";
              });
            } else if (["date", "datetime"].includes(type)) {
              _this.filteredData = _this.filteredData.filter(function (row) {
                var value = _this.getFieldValue(row, columnDef);

                var currentDate = value ? new Date(value) : null;

                if (currentDate && currentDate.toString() !== "Invalid Date") {
                  var selectedDate = tableData.filterValue;
                  var currentDateToCompare = "";
                  var selectedDateToCompare = "";

                  if (type === "date") {
                    currentDateToCompare = (0, _format["default"])(currentDate, "MM/dd/yyyy");
                    selectedDateToCompare = (0, _format["default"])(selectedDate, "MM/dd/yyyy");
                  } else if (type === "datetime") {
                    currentDateToCompare = (0, _format["default"])(currentDate, "MM/dd/yyyy - HH:mm");
                    selectedDateToCompare = (0, _format["default"])(selectedDate, "MM/dd/yyyy - HH:mm");
                  }

                  return currentDateToCompare === selectedDateToCompare;
                }

                return true;
              });
            } else if (type === "time") {
              _this.filteredData = _this.filteredData.filter(function (row) {
                var value = _this.getFieldValue(row, columnDef);

                var currentHour = value || null;

                if (currentHour) {
                  var selectedHour = tableData.filterValue;
                  var currentHourToCompare = (0, _format["default"])(selectedHour, "HH:mm");
                  return currentHour === currentHourToCompare;
                }

                return true;
              });
            } else {
              _this.filteredData = _this.filteredData.filter(function (row) {
                var value = _this.getFieldValue(row, columnDef);

                return value && value.toString().toUpperCase().includes(tableData.filterValue.toUpperCase());
              });
            }
          }
        });
      }

      _this.filtered = true;
    });
    (0, _defineProperty2["default"])(this, "searchData", function () {
      _this.grouped = _this.treefied = _this.sorted = _this.paged = false;
      _this.searchedData = (0, _toConsumableArray2["default"])(_this.filteredData);

      if (_this.searchText && _this.applySearch) {
        _this.searchedData = _this.searchedData.filter(function (row) {
          return _this.columns.filter(function (columnDef) {
            return columnDef.searchable === undefined ? !columnDef.hidden : columnDef.searchable;
          }).some(function (columnDef) {
            if (columnDef.customFilterAndSearch) {
              return !!columnDef.customFilterAndSearch(_this.searchText, row, columnDef);
            } else if (columnDef.field) {
              var value = _this.getFieldValue(row, columnDef);

              if (value) {
                return value.toString().toUpperCase().includes(_this.searchText.toUpperCase());
              }
            }
          });
        });
      }

      _this.searched = true;
    });
    this.handleCsvExport = this.handleCsvExport.bind(this);
  }

  (0, _createClass2["default"])(DataManager, [{
    key: "setData",
    value: function setData(data) {
      var _this2 = this;

      this.selectedCount = 0;
      this.data = data.map(function (row, index) {
        row.tableData = (0, _objectSpread2["default"])({}, row.tableData, {
          id: index
        });

        if (row.tableData.checked) {
          _this2.selectedCount++;
        }

        return row;
      });
      this.filtered = false;
    }
  }, {
    key: "setColumns",
    value: function setColumns(columns) {
      var undefinedWidthColumns = columns.filter(function (c) {
        return c.width === undefined;
      });
      var usedWidth = ["0px"];
      this.columns = columns.map(function (columnDef, index) {
        columnDef.tableData = (0, _objectSpread2["default"])({
          columnOrder: index,
          filterValue: columnDef.defaultFilter,
          groupOrder: columnDef.defaultGroupOrder,
          groupSort: columnDef.defaultGroupSort || "asc",
          width: columnDef.width
        }, columnDef.tableData, {
          id: index
        });

        if (columnDef.width !== undefined) {
          if (typeof columnDef.width === "number") {
            usedWidth.push(columnDef.width + "px");
          } else {
            usedWidth.push(columnDef.width);
          }
        }

        return columnDef;
      });
      usedWidth = "(" + usedWidth.join(" + ") + ")";
      undefinedWidthColumns.forEach(function (columnDef) {
        columnDef.tableData.width = "calc((100% - ".concat(usedWidth, ") / ").concat(undefinedWidthColumns.length, ")");
      });
    }
  }, {
    key: "setDefaultExpanded",
    value: function setDefaultExpanded(expanded) {
      this.defaultExpanded = expanded;
    }
  }, {
    key: "changeApplySearch",
    value: function changeApplySearch(applySearch) {
      this.applySearch = applySearch;
      this.searched = false;
    }
  }, {
    key: "changeApplyFilters",
    value: function changeApplyFilters(applyFilters) {
      this.applyFilters = applyFilters;
      this.filtered = false;
    }
  }, {
    key: "changePaging",
    value: function changePaging(paging) {
      this.paging = paging;
      this.paged = false;
    }
  }, {
    key: "changeCurrentPage",
    value: function changeCurrentPage(currentPage) {
      this.currentPage = currentPage;
      this.paged = false;
    } // === NOTE ==== added these setters =====

  }, {
    key: "setAllExportData",
    value: function setAllExportData(exportAllData) {
      this.exportAllData = exportAllData;
    }
  }, {
    key: "setExportFileName",
    value: function setExportFileName(fileName) {
      this.exportFileName = fileName;
    }
  }, {
    key: "setExportDelimeter",
    value: function setExportDelimeter(delimeter) {
      this.exportDelimeter = delimeter;
    } // ====

  }, {
    key: "changePageSize",
    value: function changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.paged = false;
    }
  }, {
    key: "changeParentFunc",
    value: function changeParentFunc(parentFunc) {
      this.parentFunc = parentFunc;
    }
  }, {
    key: "changeFilterValue",
    value: function changeFilterValue(columnId, value) {
      this.columns[columnId].tableData.filterValue = value;
      this.filtered = false;
    }
  }, {
    key: "changeRowSelected",
    value: function changeRowSelected(checked, path) {
      var _this3 = this;

      var rowData = this.findDataByPath(this.sortedData, path);
      rowData.tableData.checked = checked;
      this.selectedCount = this.selectedCount + (checked ? 1 : -1);

      var checkChildRows = function checkChildRows(rowData) {
        if (rowData.tableData.childRows) {
          rowData.tableData.childRows.forEach(function (childRow) {
            if (childRow.tableData.checked !== checked) {
              childRow.tableData.checked = checked;
              _this3.selectedCount = _this3.selectedCount + (checked ? 1 : -1);
            }

            checkChildRows(childRow);
          });
        }
      };

      checkChildRows(rowData);
      this.filtered = false;
    }
  }, {
    key: "changeDetailPanelVisibility",
    value: function changeDetailPanelVisibility(path, render) {
      var rowData = this.findDataByPath(this.sortedData, path);

      if ((rowData.tableData.showDetailPanel || "").toString() === render.toString()) {
        rowData.tableData.showDetailPanel = undefined;
      } else {
        rowData.tableData.showDetailPanel = render;
      }

      if (this.detailPanelType === "single" && this.lastDetailPanelRow && this.lastDetailPanelRow != rowData) {
        this.lastDetailPanelRow.tableData.showDetailPanel = undefined;
      }

      this.lastDetailPanelRow = rowData;
    }
  }, {
    key: "changeGroupExpand",
    value: function changeGroupExpand(path) {
      var rowData = this.findDataByPath(this.sortedData, path);
      rowData.isExpanded = !rowData.isExpanded;
    }
  }, {
    key: "changeSearchText",
    value: function changeSearchText(searchText) {
      this.searchText = searchText;
      this.searched = false;
      this.currentPage = 0;
    } // NOTE added this toolbar method here so that it can be called from the ref to MaterialTable

  }, {
    key: "handleCsvExport",
    value: function handleCsvExport() {
      var _this4 = this;

      var columns = this.columns.filter(function (columnDef) {
        return !columnDef.hidden && columnDef.field && columnDef["export"] !== false;
      }).sort(function (a, b) {
        return a.tableData.columnOrder > b.tableData.columnOrder ? 1 : -1;
      });
      var dataToExport = this.exportAllData ? this.data : this.renderData;
      var data = dataToExport.map(function (rowData) {
        return columns.map(function (columnDef) {
          return _this4.getFieldValue(rowData, columnDef);
        });
      });
      var builder = new _filefy.CsvBuilder(this.exportFileName + ".csv");
      builder.setDelimeter(this.exportDelimiter).setColumns(columns.map(function (columnDef) {
        return columnDef.title;
      })).addRows(data).exportFile();
    }
  }, {
    key: "changeRowEditing",
    value: function changeRowEditing(rowData, mode) {
      if (rowData) {
        rowData.tableData.editing = mode;

        if (this.lastEditingRow && this.lastEditingRow != rowData) {
          this.lastEditingRow.tableData.editing = undefined;
        }

        if (mode) {
          this.lastEditingRow = rowData;
        } else {
          this.lastEditingRow = undefined;
        }
      } else if (this.lastEditingRow) {
        this.lastEditingRow.tableData.editing = undefined;
        this.lastEditingRow = undefined;
      }
    }
  }, {
    key: "changeAllSelected",
    value: function changeAllSelected(checked) {
      var selectedCount = 0;

      if (this.isDataType("group")) {
        var setCheck = function setCheck(data) {
          data.forEach(function (element) {
            if (element.groups.length > 0) {
              setCheck(element.groups);
            } else {
              element.data.forEach(function (d) {
                d.tableData.checked = checked;
                selectedCount++;
              });
            }
          });
        };

        setCheck(this.groupedData);
      } else {
        this.searchedData.map(function (row) {
          row.tableData.checked = checked;
          return row;
        });
        selectedCount = this.searchedData.length;
      }

      this.selectedCount = checked ? selectedCount : 0;
    }
  }, {
    key: "changeOrder",
    value: function changeOrder(orderBy, orderDirection) {
      this.orderBy = orderBy;
      this.orderDirection = orderDirection;
      this.currentPage = 0;
      this.sorted = false;
    }
  }, {
    key: "changeGroupOrder",
    value: function changeGroupOrder(columnId) {
      var column = this.columns.find(function (c) {
        return c.tableData.id === columnId;
      });

      if (column.tableData.groupSort === "asc") {
        column.tableData.groupSort = "desc";
      } else {
        column.tableData.groupSort = "asc";
      }

      this.sorted = false;
    }
  }, {
    key: "changeColumnHidden",
    value: function changeColumnHidden(column, hidden) {
      column.hidden = hidden;
    }
  }, {
    key: "changeTreeExpand",
    value: function changeTreeExpand(path) {
      var rowData = this.findDataByPath(this.sortedData, path);
      rowData.tableData.isTreeExpanded = !rowData.tableData.isTreeExpanded;
    }
  }, {
    key: "changeDetailPanelType",
    value: function changeDetailPanelType(type) {
      this.detailPanelType = type;
    }
  }, {
    key: "changeByDrag",
    value: function changeByDrag(result) {
      var start = 0;
      var groups = this.columns.filter(function (col) {
        return col.tableData.groupOrder > -1;
      }).sort(function (col1, col2) {
        return col1.tableData.groupOrder - col2.tableData.groupOrder;
      });

      if (result.destination.droppableId === "groups" && result.source.droppableId === "groups") {
        start = Math.min(result.destination.index, result.source.index);
        var end = Math.max(result.destination.index, result.source.index);
        groups = groups.slice(start, end + 1);

        if (result.destination.index < result.source.index) {
          // Take last and add as first
          var last = groups.pop();
          groups.unshift(last);
        } else {
          // Take first and add as last
          var _last = groups.shift();

          groups.push(_last);
        }
      } else if (result.destination.droppableId === "groups" && result.source.droppableId === "headers") {
        var newGroup = this.columns.find(function (c) {
          return c.tableData.id == result.draggableId;
        });

        if (newGroup.grouping === false || !newGroup.field) {
          return;
        }

        groups.splice(result.destination.index, 0, newGroup);
      } else if (result.destination.droppableId === "headers" && result.source.droppableId === "groups") {
        var removeGroup = this.columns.find(function (c) {
          return c.tableData.id == result.draggableId;
        });
        removeGroup.tableData.groupOrder = undefined;
        groups.splice(result.source.index, 1);
      } else if (result.destination.droppableId === "headers" && result.source.droppableId === "headers") {
        start = Math.min(result.destination.index, result.source.index);

        var _end = Math.max(result.destination.index, result.source.index); // get the effective start and end considering hidden columns


        var sorted = this.columns.sort(function (a, b) {
          return a.tableData.columnOrder - b.tableData.columnOrder;
        }).filter(function (column) {
          return column.tableData.groupOrder === undefined;
        });
        var numHiddenBeforeStart = 0;
        var numVisibleBeforeStart = 0;

        for (var i = 0; i < sorted.length && numVisibleBeforeStart <= start; i++) {
          if (sorted[i].hidden) {
            numHiddenBeforeStart++;
          } else {
            numVisibleBeforeStart++;
          }
        }

        var effectiveStart = start + numHiddenBeforeStart;
        var effectiveEnd = effectiveStart;

        for (var numVisibleInRange = 0; numVisibleInRange < _end - start && effectiveEnd < sorted.length; effectiveEnd++) {
          if (!sorted[effectiveEnd].hidden) {
            numVisibleInRange++;
          }
        }

        var colsToMov = sorted.slice(effectiveStart, effectiveEnd + 1);

        if (result.destination.index < result.source.index) {
          // Take last and add as first
          var _last2 = colsToMov.pop();

          colsToMov.unshift(_last2);
        } else {
          // Take first and add as last
          var _last3 = colsToMov.shift();

          colsToMov.push(_last3);
        }

        for (var _i = 0; _i < colsToMov.length; _i++) {
          colsToMov[_i].tableData.columnOrder = effectiveStart + _i;
        }

        return;
      } else {
        return;
      }

      for (var _i2 = 0; _i2 < groups.length; _i2++) {
        groups[_i2].tableData.groupOrder = start + _i2;
      }

      this.sorted = this.grouped = false;
    }
  }, {
    key: "findGroupByGroupPath",
    value: function findGroupByGroupPath(renderData, path) {
      var data = {
        groups: renderData,
        groupsIndex: this.rootGroupsIndex
      };
      var node = path.reduce(function (result, current) {
        if (!result) {
          return undefined;
        }

        if (result.groupsIndex[current] !== undefined) {
          return result.groups[result.groupsIndex[current]];
        }

        return undefined; // const group = result.groups.find(a => a.value === current);
        // return group;
      }, data);
      return node;
    }
  }, {
    key: "isDataType",
    value: function isDataType(type) {
      var dataType = "normal";

      if (this.parentFunc) {
        dataType = "tree";
      } else if (this.columns.find(function (a) {
        return a.tableData.groupOrder > -1;
      })) {
        dataType = "group";
      }

      return type === dataType;
    }
  }, {
    key: "sort",
    value: function sort(a, b, type) {
      if (type === "numeric") {
        return a - b;
      } else {
        if (a !== b) {
          // to find nulls
          if (!a) return -1;
          if (!b) return 1;
        }

        return a < b ? -1 : a > b ? 1 : 0;
      }
    }
  }, {
    key: "sortList",
    value: function sortList(list) {
      var _this5 = this;

      var columnDef = this.columns.find(function (_) {
        return _.tableData.id === _this5.orderBy;
      });
      var result = list;

      if (columnDef.customSort) {
        if (this.orderDirection === "desc") {
          result = list.sort(function (a, b) {
            return columnDef.customSort(b, a, "row");
          });
        } else {
          result = list.sort(function (a, b) {
            return columnDef.customSort(a, b, "row");
          });
        }
      } else {
        result = list.sort(this.orderDirection === "desc" ? function (a, b) {
          return _this5.sort(_this5.getFieldValue(b, columnDef), _this5.getFieldValue(a, columnDef), columnDef.type);
        } : function (a, b) {
          return _this5.sort(_this5.getFieldValue(a, columnDef), _this5.getFieldValue(b, columnDef), columnDef.type);
        });
      }

      return result;
    }
  }, {
    key: "groupData",
    value: function groupData() {
      var _this6 = this;

      this.sorted = this.paged = false;
      this.groupedDataLength = 0;
      var tmpData = (0, _toConsumableArray2["default"])(this.searchedData);
      var groups = this.columns.filter(function (col) {
        return col.tableData.groupOrder > -1;
      }).sort(function (col1, col2) {
        return col1.tableData.groupOrder - col2.tableData.groupOrder;
      });
      var subData = tmpData.reduce(function (result, currentRow) {
        var object = result;
        object = groups.reduce(function (o, colDef) {
          var value = currentRow[colDef.field] || (0, _2.byString)(currentRow, colDef.field);
          var group;

          if (o.groupsIndex[value] !== undefined) {
            group = o.groups[o.groupsIndex[value]];
          }

          if (!group) {
            var path = [].concat((0, _toConsumableArray2["default"])(o.path || []), [value]);
            var oldGroup = _this6.findGroupByGroupPath(_this6.groupedData, path) || {
              isExpanded: typeof _this6.defaultExpanded === "boolean" ? _this6.defaultExpanded : false
            };
            group = {
              value: value,
              groups: [],
              groupsIndex: {},
              data: [],
              isExpanded: oldGroup.isExpanded,
              path: path
            };
            o.groups.push(group);
            o.groupsIndex[value] = o.groups.length - 1;
          }

          return group;
        }, object);
        object.data.push(currentRow);
        _this6.groupedDataLength++;
        return result;
      }, {
        groups: [],
        groupsIndex: {}
      });
      this.groupedData = subData.groups;
      this.grouped = true;
      this.rootGroupsIndex = subData.groupsIndex;
    }
  }, {
    key: "treefyData",
    value: function treefyData() {
      var _this7 = this;

      this.sorted = this.paged = false;
      this.data.forEach(function (a) {
        return a.tableData.childRows = null;
      });
      this.treefiedData = [];
      this.treefiedDataLength = 0;
      this.treeDataMaxLevel = 0; // if filter or search is enabled, collapse the tree

      if (this.searchText || this.columns.some(function (columnDef) {
        return columnDef.tableData.filterValue;
      })) {
        this.data.forEach(function (row) {
          row.tableData.isTreeExpanded = false;
        }); // expand the tree for all nodes present after filtering and searching

        this.expandTreeForNodes(this.searchedData);
      }

      var addRow = function addRow(rowData) {
        rowData.tableData.markedForTreeRemove = false;

        var parent = _this7.parentFunc(rowData, _this7.data);

        if (parent) {
          parent.tableData.childRows = parent.tableData.childRows || [];

          if (!parent.tableData.childRows.includes(rowData)) {
            parent.tableData.childRows.push(rowData);
            _this7.treefiedDataLength++;
          }

          addRow(parent);
          rowData.tableData.path = [].concat((0, _toConsumableArray2["default"])(parent.tableData.path), [parent.tableData.childRows.length - 1]);
          _this7.treeDataMaxLevel = Math.max(_this7.treeDataMaxLevel, rowData.tableData.path.length);
        } else {
          if (!_this7.treefiedData.includes(rowData)) {
            _this7.treefiedData.push(rowData);

            _this7.treefiedDataLength++;
            rowData.tableData.path = [_this7.treefiedData.length - 1];
          }
        }
      }; // Add all rows initially


      this.data.forEach(function (rowData) {
        addRow(rowData);
      });

      var markForTreeRemove = function markForTreeRemove(rowData) {
        var pointer = _this7.treefiedData;
        rowData.tableData.path.forEach(function (pathPart) {
          if (pointer.tableData && pointer.tableData.childRows) {
            pointer = pointer.tableData.childRows;
          }

          pointer = pointer[pathPart];
        });
        pointer.tableData.markedForTreeRemove = true;
      };

      var traverseChildrenAndUnmark = function traverseChildrenAndUnmark(rowData) {
        if (rowData.tableData.childRows) {
          rowData.tableData.childRows.forEach(function (row) {
            traverseChildrenAndUnmark(row);
          });
        }

        rowData.tableData.markedForTreeRemove = false;
      }; // for all data rows, restore initial expand if no search term is available and remove items that shouldn't be there


      this.data.forEach(function (rowData) {
        if (!_this7.searchText && !_this7.columns.some(function (columnDef) {
          return columnDef.tableData.filterValue;
        })) {
          if (rowData.tableData.isTreeExpanded === undefined) {
            var isExpanded = typeof _this7.defaultExpanded === "boolean" ? _this7.defaultExpanded : _this7.defaultExpanded(rowData);
            rowData.tableData.isTreeExpanded = isExpanded;
          }
        }

        var hasSearchMatchedChildren = rowData.tableData.isTreeExpanded;

        if (!hasSearchMatchedChildren && _this7.searchedData.indexOf(rowData) < 0) {
          markForTreeRemove(rowData);
        }
      }); // preserve all children of nodes that are matched by search or filters

      this.data.forEach(function (rowData) {
        if (_this7.searchedData.indexOf(rowData) > -1) {
          traverseChildrenAndUnmark(rowData);
        }
      });

      var traverseTreeAndDeleteMarked = function traverseTreeAndDeleteMarked(rowDataArray) {
        for (var i = rowDataArray.length - 1; i >= 0; i--) {
          var item = rowDataArray[i];

          if (item.tableData.childRows) {
            traverseTreeAndDeleteMarked(item.tableData.childRows);
          }

          if (item.tableData.markedForTreeRemove) rowDataArray.splice(i, 1);
        }
      };

      traverseTreeAndDeleteMarked(this.treefiedData);
      this.treefied = true;
    }
  }, {
    key: "sortData",
    value: function sortData() {
      var _this8 = this;

      this.paged = false;

      if (this.isDataType("group")) {
        this.sortedData = (0, _toConsumableArray2["default"])(this.groupedData);
        var groups = this.columns.filter(function (col) {
          return col.tableData.groupOrder > -1;
        }).sort(function (col1, col2) {
          return col1.tableData.groupOrder - col2.tableData.groupOrder;
        });

        var sortGroups = function sortGroups(list, columnDef) {
          if (columnDef.customSort) {
            return list.sort(columnDef.tableData.groupSort === "desc" ? function (a, b) {
              return columnDef.customSort(b.value, a.value, "group");
            } : function (a, b) {
              return columnDef.customSort(a.value, b.value, "group");
            });
          } else {
            return list.sort(columnDef.tableData.groupSort === "desc" ? function (a, b) {
              return _this8.sort(b.value, a.value, columnDef.type);
            } : function (a, b) {
              return _this8.sort(a.value, b.value, columnDef.type);
            });
          }
        };

        this.sortedData = sortGroups(this.sortedData, groups[0]);

        var sortGroupData = function sortGroupData(list, level) {
          list.forEach(function (element) {
            if (element.groups.length > 0) {
              var column = groups[level];
              element.groups = sortGroups(element.groups, column);
              sortGroupData(element.groups, level + 1);
            } else {
              if (_this8.orderBy >= 0 && _this8.orderDirection) {
                element.data = _this8.sortList(element.data);
              }
            }
          });
        };

        sortGroupData(this.sortedData, 1);
      } else if (this.isDataType("tree")) {
        this.sortedData = (0, _toConsumableArray2["default"])(this.treefiedData);

        if (this.orderBy != -1) {
          this.sortedData = this.sortList(this.sortedData);

          var sortTree = function sortTree(list) {
            list.forEach(function (item) {
              if (item.tableData.childRows) {
                item.tableData.childRows = _this8.sortList(item.tableData.childRows);
                sortTree(item.tableData.childRows);
              }
            });
          };

          sortTree(this.sortedData);
        }
      } else if (this.isDataType("normal")) {
        this.sortedData = (0, _toConsumableArray2["default"])(this.searchedData);

        if (this.orderBy != -1) {
          this.sortedData = this.sortList(this.sortedData);
        }
      }

      this.sorted = true;
    }
  }, {
    key: "pageData",
    value: function pageData() {
      this.pagedData = (0, _toConsumableArray2["default"])(this.sortedData);

      if (this.paging) {
        var startIndex = this.currentPage * this.pageSize;
        var endIndex = startIndex + this.pageSize;
        this.pagedData = this.pagedData.slice(startIndex, endIndex);
      }

      this.paged = true;
    }
  }]);
  return DataManager;
}();

exports["default"] = DataManager;