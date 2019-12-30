import React, { Component } from 'react'
import { RedirectToGitLabForOAuth, GetGitLabOAuthURL } from '../OAuth';
import { Row, Col, NavLink , Alert } from "reactstrap";
import Octicon, { Hubot, Book, File } from "@githubprimer/octicons-react";

import qs from 'qs';
import { Loader } from './utilities/loader';

import { RouteUrls } from '../constants/route-urls'
import { ParseQueryString } from '../utils/index'

export class Home extends Component {
  constructor (props) {
    super(props)
    if (this.props.oAuth.token) {
      this.props.setUserInfoToNull()
    }
    this.state = {
      isLoading: true,
      hasRequestFailed: false,
      showHomePage: false
    }
  }

  componentDidMount () {
    this.getAuthorizationCode()
  }

  // parseQuerystring = () => {
  //   const { location, querystring } = this.props;
  //   let search;

  //   if (location != null) {
  //     search = location.search; // eslint-disable-line
  //   } else if (querystring != null) {
  //     search = querystring;
  //   } else {
  //     search = window.location.search; // eslint-disable-line
  //   }

  //   return qs.parse(search, { ignoreQueryPrefix: true });
  // };

  getAuthorizationCode = () => {
    const { location, querystring } = this.props
    const params = ParseQueryString(location, querystring)
    if (params.gitlab_token !== undefined) {
      this.props.setOAuthToken(params.gateway_token, params.gitlab_token)
      if (params.deep_linking_path === '') {
        this.props.history.push(RouteUrls.SELF_SERVICE)
      } else {
        this.props.history.push(
          `${RouteUrls.SELF_SERVICE}?deep_linking_path=${
          params.deep_linking_path
          }`
        )
      }
    } else if (params.error !== undefined) {
      this.setState({
        isLoading: false,
        hasRequestFailed: true
      })
    } else {
      this.setState({
        isLoading: false,
        showHomePage: true
      })
    }
  };

  redirectToGitLab = () => {
    RedirectToGitLabForOAuth()
  };

  handleClick = link => {
    this.props.history(link)
  };

  getIcon = icon => {
    return <Octicon size="large" icon={icon} />
  };

  getNavLink = (text, link, icon, color, isNewTab) => {
    if (link.startsWith('/')) {
      return (
        <NavLink onClick={this.handleClick(link)} className={`text-${color}`}>
          {this.getIcon(icon)}
          <br />
          {text}
        </NavLink>
      )
    } else {
      return (
        <NavLink
          target={isNewTab ? '_blank' : ''}
          href={link}
          className={`text-${color}`}
        >
          {this.getIcon(icon)}
          <br />
          <b>{text}</b>
        </NavLink>
      )
    }
  };

  getNavLinkWithIcon = (text, link, icon, color, isNewTab, image) => {
    return (
      <Col xs="12" sm="6" md="4" lg="3">
        <span className={`text-${color} text-center`}>
          {this.getNavLink(text, link, icon, color, isNewTab, image)}
        </span>
      </Col>
    )
  };

  render () {
    const { isLoading, hasRequestFailed, showHomePage } = this.state
    const showLoader = isLoading
    const showAlert = !isLoading && hasRequestFailed
    const displayHomePage = !isLoading && showHomePage
    return (
      <div>
        <Loader isLoading={showLoader} />
        <div className={showAlert ? '' : 'd-none'}>
          <Alert color="danger">
            <h6>Sorry for the inconvience, something went wrong!</h6>
            <br />
            Please reach out to <b>InfoSec IAM</b> team for further assitance.
          </Alert>
        </div>
        <div className={displayHomePage ? '' : 'd-none'}>
          <Row>


          </Row>
          <br />
          <Row>
            <Col xs="12" lg="12" className="text-center">
              <h3>
                Keffeler POC Site
              </h3>
              <h5>
                A collection of POCs (Proof of Concepts) presented by Miclain Keffeler.
              </h5>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
