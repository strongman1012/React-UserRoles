import React, { useState } from 'react';
import { Stack, Slider, Typography } from '@mui/material';
import DataGrid from 'devextreme-react/data-grid';
import HeatMap from './HeatMap';
import { RowData } from '../types/HeatMapTypes';
import { orders, color_array } from './data';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  slider: {
    '& .MuiSlider-thumb': {
      position: 'absolute',
      borderTop: '10px solid transparent',
      borderBottom: '10px solid transparent',
      borderLeft: '20px solid currentColor',
      right: '4px',
      transform: 'translate(-50%, -50%) translateY(19px)',
      backgroundColor: 'transparent',
      borderRadius: 0,
      width: 0,
      height: 0,
      left: 0
    }
  }
}));
const HeatMapSlider: React.FC = () => {
  const classes = useStyles();
  const [startColor, setStartColor] = useState<string>('#0000ff');
  const [endColor, setEndColor] = useState<string>('#ffff00');
  const [data, setData] = useState<RowData[]>(orders);

  const handleSlider = (e: any) => {
    setStartColor(color_array[e.target?.value[0]]);
    setEndColor(color_array[e.target?.value[1]]);

    const tempData = orders.filter((row: RowData) => {
      return row.Score >= e.target?.value[0] && row.Score <= e.target?.value[1]
    });
    setData(tempData);
  }
  return (
    <>
      <Stack className={classes.slider} height="70%" width="100%" spacing={5} padding={5} boxSizing="border-box" justifyContent="space-between" direction="row">

        <DataGrid
          id="grid"
          dataSource={data}
          keyExpr="Company"
          showBorders={true}
        />
        <Slider
          orientation="vertical"
          defaultValue={[0, 100]}
          valueLabelDisplay="on"
          onChange={handleSlider}
          style={{ height: '300px', marginRight: '-40px' }}
        />
        <HeatMap />
        <Typography style={{ color: startColor }}>startColor {startColor},</Typography>
        <Typography style={{ color: endColor }}>endColor {endColor}</Typography>
      </Stack>
    </>
  );
}

export default HeatMapSlider;
