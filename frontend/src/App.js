import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import DownloadAndPreview from './component/DownloadAndPreview'
import Upload from './/component/Upload'
import Loader from './component/Loader/Loader';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
 
    return (
      <BrowserRouter>
      <div className="container">
      {this.props.loaderReducer.isFetching ? <Loader /> : null}
        <div className="row">         
          <Switch>
              <Route exact path="/"  {...this.props} component={Upload} />
              <Route path="/download"   {...this.props} component={DownloadAndPreview} />
            </Switch>
        </div>
      </div>
      </BrowserRouter>
    )
}
}

const mapStateToProps = state => ({
  loaderReducer: { ...state.loaderReducer }
});


const AppMapped = connect(
  mapStateToProps,
  null
)(App);

export default (AppMapped);

