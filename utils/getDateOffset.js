/**
 * Returns Date object with date of first workday of next week
 * Depending on current date
  */

module.exports.startOfNextWeek = function() {
    let now = new Date();
    let numberOfDaysToAdd = 7 - now.getDay();
    now.setDate(now.getDate() + numberOfDaysToAdd); 
    return now
}

/**
 * Returns Date object with date of last day of next week
 * Depending on current date
  */

module.exports.endOfNextWeek = function() {
    let now = new Date();
    let numberOfDaysToAdd = 7 - now.getDay();
    now.setDate(now.getDate() + numberOfDaysToAdd + 7); 
    return now
}

/**
 * Returns Date object with date 01.[previous month].year
 * Depending on current date
  */

module.exports.startOfPreviousMonth = function() {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth()-1, 1)
}

/**
 * Returns Date object with date "last day of previous month"
 * Depending on current date
  */

module.exports.endOfPreviousMonth = function() {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 0)
}

/**
 * Returns Date object with date 01.[this month].year
 * Depending on current date
  */

module.exports.startOfThisMonth = function() {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
}