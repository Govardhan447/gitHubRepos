import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'

import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstant = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    languagesDetails: languageFiltersData,
    chooseLanguage: languageFiltersData[0].id,
    repositoryList: [],
    apiStatus: apiStatusConstant.success,
  }

  componentDidMount() {
    this.getRepositaryListDetails()
  }

  getRepositaryListDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.inprogress})
    const {chooseLanguage} = this.state
    console.log(chooseLanguage)
    const url = `https://apis.ccbp.in/popular-repos?language=${chooseLanguage}`

    const response = await fetch(url)
    const data = await response.json()
    const repositoryData = data.popular_repos
    console.log(repositoryData)
    if (response.ok === true) {
      const upadateList = repositoryData.map(item => ({
        name: item.name,
        id: item.id,
        issuesCount: item.issues_count,
        forksCount: item.forks_count,
        startsCount: item.stars_count,
        avatarUrl: item.avatar_url,
      }))

      this.setState({
        apiStatus: apiStatusConstant.success,
        repositoryList: upadateList,
      })
    } else if (data.status_code === 401) {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  selectLanguage = id => {
    const {languagesDetails} = this.state
    const updateLanguage = languagesDetails.filter(item => item.id === id)

    this.setState({chooseLanguage: updateLanguage[0].id})
  }

  getLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  getRepositaryList = () => {
    const {repositoryList} = this.state

    return (
      <ul className="respositary-container">
        {repositoryList.map(item => (
          <RepositoryItem repositoryItemDetails={item} key={item.id} />
        ))}
      </ul>
    )
  }

  getFailureStatus = () => (
    <>
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure"
      />
      <h1 className="error-heading">Something Went Wrong</h1>
    </>
  )

  getHeader = () => {
    const {languagesDetails, chooseLanguage} = this.state
    return (
      <>
        <h1 className="heading">Popular</h1>
        <ul className="language-btn-container">
          {languagesDetails.map(eachItem => (
            <LanguageFilterItem
              languageType={eachItem}
              key={eachItem.id}
              selectLanguage={this.selectLanguage}
              isSelected={eachItem.id === chooseLanguage}
            />
          ))}
        </ul>
      </>
    )
  }

  getRespositaryStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.getRepositaryList()

      case apiStatusConstant.failure:
        return this.getFailureStatus()

      case apiStatusConstant.inprogress:
        return this.getLoading()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        {this.getHeader()} {this.getRespositaryStatus()}
      </div>
    )
  }
}

export default GithubPopularRepos
