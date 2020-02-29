/**
 * 微信测速耗时计算SDK
 * let pfmRecord = startRecord(1001)
 * pfmRecord.finish()
 */
const startTimeMap = {}
let count = 0

function startRecord(pfmId) {
  let key = `${pfmId}_${count++}`
  startTimeMap[key] = new Date().getTime()
  // console.log(`[wx-performance]start record, pfmId: ${pfmId}, key: ${key}`)
  return {
    finish() {
      if (startTimeMap[key] === undefined) {
        return
      }
      let cost = finishRecord(key)
      report(pfmId, cost)
    }
  }
}

function finishRecord(key) {
  if (startTimeMap[key] === undefined) {
    console.warn(`[wx-performance]finishRecord api, lack start time`)
    return
  }
  let cost = new Date().getTime() - startTimeMap[key]
  // console.log(`[wx-performance]finish record, key: ${key}, cost: ${cost}`)
  delete startTimeMap[key]
  
  return cost
}

function report(pfmId, cost){
  if (cost === undefined || pfmId === undefined) {
    console.warn(`[wx-performance]report api needs cost and pfmId`)
    return
  }
  // console.log(`[wx-performance]report, id: ${pfmId}, cost: ${cost}`)
  if (wx.reportPerformance) {
    wx.reportPerformance(pfmId, cost)
  }
}

export default {
  startRecord
}