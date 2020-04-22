import React, { Component } from 'react';
// import { Document, Page } from 'react-pdf';


class DocumentPreview extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }


  render() {
    const { url } = this.props;


    return (
      <div className="pdfPreview">
        <object width="100%" height="500" data={url} type="application/pdf">   </object>
      </div>
    );
  }
}


export default DocumentPreview;