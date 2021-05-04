import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'

import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, Legend } from 'recharts'

import progressService from '../services/progress'

import Title from './Title'

// eslint-disable-next-line no-undef
const _ = require('lodash')
// eslint-disable-next-line no-undef
const moment = require('moment')

export default function Chart() {
  const theme = useTheme()
  const [progress, setProgress] = useState([])

  useEffect(() => {
    progressService
      .getAll()
      .then(response => {
        setProgress(response)
      })
  }, [])

  const dataSortedByDate = _.sortBy(progress, 'date')

  const result = _(dataSortedByDate)
    .groupBy((x) => x.date)
    .map((value, key) => ({
      date: moment(key).format('DD-MM'),
      suggestedCalories: _.sumBy(value, 'suggestedCalories'),
      totalCalories: _.sumBy(value, 'totalCalories'),
    }))
    .value()

  return (
    <React.Fragment>
      <Title>{moment(new Date()).format('MMMM YYYY') + ' Progress'}</Title>
      <ResponsiveContainer>
        <LineChart
          data={result}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="date" stroke={theme.palette.text.secondary}>
            <Label
              position="insideBottomRight"
              offset={-2}
              style={{ textAnchor: 'middle', fill: theme.palette.secondary.main }}
            >
              Day
            </Label>
          </XAxis>
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.secondary.main }}
            >
              Calories (Kcal)
            </Label>
          </YAxis>
          <Tooltip />
          <Legend />
          <Line
            name="Calories Suggested"
            dataKey="suggestedCalories"
            stroke="#1eb040"
            fill="#1eb040"
            activeDot={{ r: 8 }}
          />
          <Line
            name="Calories Ingested"
            dataKey="totalCalories"
            stroke="#d93b3b"
            fill="#d93b3b"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}