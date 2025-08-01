import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import { makeStyles } from '@material-ui/core/styles'

import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Paper
} from '@material-ui/core';

import TablePaginationActions from './section-table-pagination-actions/section-table-pagination-actions';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  table: {
    minWidth: 500
  },
  tableCell: {
    root: {
      padding: 5
    }
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  chipStatusSuccess: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main
  },
  chipStatusClosed: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.error.main
  },
  avatarStatusSuccess: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.primary.main
  },
  avatarStatusClosed: {
    width: theme.spacing(0),
    height: theme.spacing(0),
    backgroundColor: theme.palette.error.main
  }
}));

type MetaDataProps = {
  numeric: boolean,
  dataBaseKey: string,
  label: string
};

const SectionTable = ({ tableData, tableHeaderMetadata, customColumnRenderer = {} }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortedBy, setSortedBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortedData, setSortedData] = useState(tableData.data);

  useEffect(() => {
    const newSortedData = sortData(tableData.data, sortedBy, sortDirection);
    setSortedData(newSortedData);
  }, [tableData, sortedBy, sortDirection]);

  const sortData = (data, sortedBy, sortDirection) => {
    if (sortDirection === 'none') return data;
    if (!sortedBy) return data;

    return [...data].sort((a, b) => {
      let aValue = getSortingValue(a, sortedBy);
      let bValue = getSortingValue(b, sortedBy);

      if (aValue === null || bValue === null) {
        return aValue === null ? (sortDirection === 'asc' ? -1 : 1) : (sortDirection === 'asc' ? 1 : -1);
      }

      if (sortedBy === 'task.table.head.createdAt') {
        let aDate = new Date(aValue).getTime();
        let bDate = new Date(bValue).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (sortedBy === 'task.table.head.labels') {
        aValue = aValue.map(label => label.name).join('');
        bValue = bValue.map(label => label.name).join('');
      }

      let comparator = String(aValue).localeCompare(String(bValue), 'en', { numeric: true, sensitivity: 'base', ignorePunctuation: true });
      return sortDirection === 'asc' ? comparator : -comparator;
    });
  };

  const getSortingValue = (item, fieldId) => {
    const getValue = (item, dataBaseKey) => {
      const keys = dataBaseKey.split('.');
      return keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, item);
    };

    

    const metadata = tableHeaderMetadata[fieldId];
    if (!metadata) {
      console.error(`No metadata found for fieldId: ${fieldId}`);
      return null;
    }

    const { numeric, dataBaseKey } = metadata;
    const value = getValue(item, dataBaseKey);

    if (value === undefined) {
      console.error(`Failed to get value for fieldId: ${fieldId}`);
      return null;
    }

    if (numeric) {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        console.error(`Failed to parse numeric value for fieldId: ${fieldId}`);
        return null;
      }
      return parsedValue;
    }
    return value;
  };

  const handleSort = (fieldId, sortDirection) => {
    const newSortedData = sortData(tableData.data, fieldId, sortDirection);
    setSortedBy(fieldId);
    setSortDirection(sortDirection);
    setSortedData(newSortedData);
  };

  const sortHandler = fieldId => {
    setSortedBy(prevSortedBy => {
      const newSortDirection = prevSortedBy === fieldId ? (sortDirection === 'asc' ? 'desc' : (sortDirection === 'desc' ? 'none' : 'asc')) : 'asc';
      handleSort(fieldId, newSortDirection);
      return fieldId;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = sortedData.length ? rowsPerPage - Math.min(rowsPerPage, sortedData.length - page * rowsPerPage) : 0;

  const TableCellWithSortLogic = ({ fieldId, defaultMessage, sortHandler }) => (
    <TableSortLabel
      active={fieldId === sortedBy && sortDirection !== 'none'}
      direction={sortDirection as 'asc' | 'desc'}
      onClick={() => sortHandler(fieldId)}
    >
      {defaultMessage}
    </TableSortLabel>
  );

  const TableHeadCustom = () => (
    <TableHead>
      <TableRow>
        {Object.entries(tableHeaderMetadata).map(([fieldId, metadata]: [string, MetaDataProps]) => (
          <TableCell key={fieldId}>
            <TableCellWithSortLogic sortHandler={sortHandler} fieldId={fieldId} defaultMessage={metadata.label} />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  if (tableData.completed && tableData.data.length === 0) {
    return (
      <Paper className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography variant="caption">
            <FormattedMessage id="task.table.body.noData" defaultMessage="No data" />
          </Typography>
        </div>
      </Paper>
    );
  }

  const TableRowPlaceholder = (
    <React.Fragment>
      {[0, 1, 2, 3, 4, 5].map(() => (
        <TableRow>
          {[0, 1, 2, 3, 4, 5].map(() => (
            <TableCell className={classes.tableCell}>
              <div style={{ width: 80, padding: '8px 4px' }}>
                <ReactPlaceholder showLoadingAnimation type="text" rows={1} ready={tableData.completed}>
                  <div />
                </ReactPlaceholder>
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </React.Fragment>
  );

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHeadCustom />
          <TableBody>
            <ReactPlaceholder style={{ marginBottom: 20, padding: 20 }} showLoadingAnimation customPlaceholder={TableRowPlaceholder} ready={tableData.completed}>
                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n) => (
                <TableRow key={n.id}>
                  {Object.entries(tableHeaderMetadata).map(([fieldId]) => (
                  <TableCell key={fieldId} className={classes.tableCell}>
                    <ReactPlaceholder showLoadingAnimation type="text" rows={1} ready={tableData.completed}>
                    <div>
                      {customColumnRenderer?.[fieldId] ? customColumnRenderer[fieldId](n) : n[fieldId]}
                    </div>
                    </ReactPlaceholder>
                  </TableCell>
                  ))}
                </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </ReactPlaceholder>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, page) => handleChangePage(e, page)}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Paper>
  );
};

export default SectionTable;
