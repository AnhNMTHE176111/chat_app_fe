import React from 'react';
import { Skeleton } from '@mui/material';

interface TableSkeletonProps {
  loading: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ loading }) => {
  if (loading) {
    return (
      <table className="q-markup-table">
        <thead>
          <tr>
            <th className="text-left" style={{ width: '200px' }}>
              <Skeleton animation="wave" variant="text" />
            </th>
            <th className="text-right" style={{ width: '100px' }}>
              <Skeleton animation="wave" variant="text" />
            </th>
            <th className="text-right" style={{ width: '100px' }}>
              <Skeleton animation="wave" variant="text" />
            </th>
            <th className="text-right" style={{ width: '100px' }}>
              <Skeleton animation="wave" variant="text" />
            </th>
            <th className="text-right" style={{ width: '100px' }}>
              <Skeleton animation="wave" variant="text" />
            </th>
            <th className="text-right" style={{ width: '100px' }}>
              <Skeleton animation="wave" variant="text" />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(14)].map((_, index) => (
            <tr key={index}>
              <td className="text-left">
                <Skeleton animation="wave" variant="text" width="120px" />
              </td>
              <td className="text-right">
                <Skeleton animation="wave" variant="text" width="80px" />
              </td>
              <td className="text-right">
                <Skeleton animation="wave" variant="text" width="60px" />
              </td>
              <td className="text-right">
                <Skeleton animation="wave" variant="text" width="100px" />
              </td>
              <td className="text-right">
                <Skeleton animation="wave" variant="text" width="40px" />
              </td>
              <td className="text-right">
                <Skeleton animation="wave" variant="text" width="120px" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return null; // or you can return an empty fragment if no loading state handling is needed
  }
};

export default TableSkeleton;
