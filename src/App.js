import React, { useRef } from 'react'
import './App.css';

import Logo from './logo-stacked.svg'
import LogoInline from './logo-inline.svg'

import { observer } from 'mobx-react-lite';

export const App = observer(({ store }) => {

  const searchRef = useRef(null)

  const {
    chartItems,
    chartComplete,
    searchQuery,
    searchResults,
    searching,
    searchIndex,
  } = store

  function handleChange(e) {
    const val = e.currentTarget.value;
    store.setSearchQuery(val)
  }

  function handleKeyUp(e) {
    store.search(searchQuery)
    console.log(e.keyCode)
    if (e.keyCode === 40) {
      store.setSearchIndex('down')
    }
    if (e.keyCode === 38) {
      store.setSearchIndex('up')
    }
    if (e.keyCode === 27) {
      store.setSearchQuery('')
      searchRef.current.blur()
    }
  }

  function handleRemoveClick() {
    if(searching) {
      store.setSearchQuery('')
    }
  }

  const ChartItem = ({ chart, order }) => {
    return (
      <li className="ChartItem">
        <div className="ChartItem__wrap">
          <strong className="ChartItem__count">{order}</strong>
          {chart.name ?
            <span>{chart.name}</span>
            :
            <span className="ChartItem__placeholder">Choose an artist</span>
          }
        </div>
        { chart.name &&
          <div className="ChartItem__actions">
            <i className="fa fa-chevron-up ChartItem__action"></i>
            <i className="fa fa-chevron-down ChartItem__action"></i>
            <i className="fa fa-remove ChartItem__action" onClick={() => store.removeChartItem(order - 1)}></i>
          </div>
        }
      </li>
    )
  }

  const chartItemsList = chartItems.map((c, i) => {
    return (
      <ChartItem chart={c} order={i + 1} key={`chart-item-${i}`} />
    )
  })

  const resultsList = searchResults.length && searchResults.map((r, i) => {
    const hasImages = r.images.length > 0
    const firstImage = hasImages && r.images[0].url
    return (
      <li className={`ResultsItem ${searchIndex === i ? 'ResultsItem--active' : ''}`}>
        {hasImages ?
          <div className="ResultsItem__thumb" style={{ backgroundImage: `url(${firstImage})` }}></div>
          :
          <div className="ResultsItem__thumb"></div>
        }
        <span>{r.name}</span>
      </li>
    )
  })

  return (
    <div className="App">
      <div className="container">
        <header className="text-centered">
          <img src={LogoInline} alt="" className="App__logo"/>
          <h1>Top 5 artists of all time</h1>
          <div className={`Search ${searchQuery.length ? 'Search--filled' : ''} ${chartComplete ? 'disabled' : ''}`}>
            <input
              type="input"
              id="input"
              ref={searchRef}
              className="Search__input"
              value={searchQuery}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              disabled={chartComplete}
            />
            <label htmlFor="input" className="Search__label">Search for an artist</label>
            <i
              onClick={handleRemoveClick}
              className={`fa ${searching ? 'fa-remove' : 'fa-search'} Search__icon`}
            ></i>
          </div>
        </header>
        <div className="App__content">
          <div className={`Chart ${searching ? 'Chart--searching' : ''}`}>
            <ol className="Chart__list">
              {chartItemsList}
            </ol>
            <footer className="Chart__actions">
              <button className="btn btn--primary" disabled={!chartComplete}>
                Publish chart
              </button>
              <button className="btn" onClick={() => store.resetChart()}>
                Reset chart
              </button>
            </footer>
          </div>
          <div className={`Results ${searching ? 'Results--searching' : ''}`}>
            <ol className="Results__list">
              {resultsList}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
});

export default App;
