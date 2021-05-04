import React, { useEffect, useState } from 'react'

import personalInfo from '../services/personalInfo'

import Typography from '@material-ui/core/Typography'
import Title from './Title'

// eslint-disable-next-line no-undef
const _ = require('lodash')
// eslint-disable-next-line no-undef
const moment = require('moment')

function TotalProgress(props) {
  const [info, setInfo] = useState([])

  const onlyValuesFromToday = (arr) => _.filter(arr, function(o){
    if(moment(o.date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')) return o
  })

  const fetchData = async () => {
    await personalInfo
      .getAll()
      .then(response => {
        let newArray = onlyValuesFromToday(response)
        setInfo(info.concat(newArray))
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalSuggestedCalories = info.map((x) =>
    Math.ceil(((x.weight * 10) + (625 * x.height) - (5 * x.age) + x.genderconstant) * x.activityconstant + x.goalconstant))

  return (
    <div>
      <Typography color="textSecondary">
        {moment(new Date()).format('MMM Do YYYY')}
      </Typography>
      <Title>Suggested Calories</Title>
      <Typography component="p" variant="h4" style={{ color: '#1eb040' }}>
        {totalSuggestedCalories}
      </Typography>
      <Title>Total Calories Today</Title>
      <Typography component="p" variant="h4" style={{ color: '#d93b3b' }}>
        {props.totalCalories}
      </Typography>
      {props.totalSuggestedCalories}
    </div>
  )
}

export default TotalProgress