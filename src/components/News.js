import React, { Component } from 'react'
import NewsItems from './NewsItems'
import Spin from './Spin';
import PropTypes, { string } from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {
    static defaultProps = {
        country : "us",
        pageSize : 3,
        category : "general",
    }

    static propTypes = {
        country : PropTypes.string,
        pageSize : PropTypes.number,
        category : PropTypes.string,
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    constructor(props) {
        super(props);
        console.log("Hello I am a constructor from a news component");
        this.state = {
           articles : [],
           loading : false,
           page : 1,
           totalResults : 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsFlash`
    }


    async componentDidMount(){
        this.props.setProgress(0);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=
        ${this.props.pageSize}`;
        this.setState({loading : true});
        let data = await fetch(url);
        this.props.setProgress(30);
        let parseData = await data.json();
        this.props.setProgress(60);
        console.log(parseData);
        this.setState({articles: parseData.articles, 
            totalResults: parseData.totalResults,
            loading: false
        })
        this.props.setProgress(100);
    }


    fetchMoreData = async() => {
         let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=
         ${this.state.page-1}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url);
            let parseData = await data.json();
            this.setState({
                page : this.state.page-1,
                articles: this.state.articles.concat(parseData.articles),
                loading : false
            })   
            this.setState({page : this.state.page + 1}) 
    };

  render() {
    return (
      <>
        <h1 className='text-center' style={{margin:'35px 0px', marginTop: '85px'}}>NewsFlash - Top  {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spin/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spin/>}>

            <div className='container'>
            <div className='row'>
                {this.state.articles.map((element, index)=>{
                    const uniqueKey = `${element.url}-${element.title}-${element.publishedAt}-${index}`;
                    return <div className='col-md-4' key={uniqueKey}>
                    <NewsItems title ={element.title?element.title:""} description ={element.description?element.description:""} imageUrl = {element.urlToImage}
                    newsUrl = {element.url} author = {element.author} date = {element.publishedAt} source = {element.source.name} />
                </div>
                })}
            </div>
            </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News
