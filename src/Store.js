import { makeAutoObservable, action } from 'mobx';

export default class Store {
  chartItems
  chartComplete
  chartIndex

  searching
  searchIndex = []
  searchQuery = ''
  searchResultsIndex = 0

  constructor(chartItems) {
    makeAutoObservable(this)
    this.chartItems = [{},{},{},{},{}]
  }

  get chartIndex() {
    return this.chartItems.findIndex(c => !c.name)
  }

  get chartComplete() {
    return this.chartItems.filter(c => c.name).length === 5
  }

  get searching() {
    return this.searchQuery.length > 0
  }

  setSearchQuery(query) {
    this.searchQuery = query
  }

  setSearchIndex(dir) {
    if (dir === 'down') {
      this.searchResults += 1
    } else if (dir === 'up') {
      this.searchResults -= 1
    }
  }

  addChartItem(chart) {
    this.chartItems[this.chartIndex || 0] = chart
  }

  removeChartItem(i) {
    console.log(i)
    this.chartItems[i] = {}
  }

  resetChart() {
    this.chartItems = [
      {},
      {},
      {},
      {},
      {}
    ]
  }

  search(query) {
    fetch(`http://localhost:4040/search/artists?artist=${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then((json) => {
        // this should be an `action`
        this.searchResults = json || []
      })
  }
}
