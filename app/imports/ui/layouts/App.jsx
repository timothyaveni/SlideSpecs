import React from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session.js";
import PropTypes from "prop-types";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
// import queryString from "query-string";

import AppModal from "../components/AppModal.jsx";
import Loading from "../components/Loading.jsx";
import AppNotification from "../components/AppNotification.jsx";
import BaseComponent from "../components/BaseComponent.jsx";
import UserContainer from "../containers/UserContainer.jsx";
import TalkContainer from "../containers/TalkContainer.jsx";
import SessionContainer from "../containers/SessionContainer";
import SpeakerContainer from "../containers/SpeakerContainer";
import { checkUserTalk } from "../../api/talks/methods.js";
import { checkUserSession } from "../../api/sessions/methods.js";

import AuthPageSignIn from "../pages/AuthPageSignIn.jsx";
import AuthPageSignUp from "../pages/AuthPageSignUp.jsx";
import TalkPage from "../pages/TalkPage.jsx";
import GuidePage from "../pages/GuidePage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import CommentPage from "../pages/CommentPage.jsx";
import SessionPage from "../pages/SessionPage.jsx";
import UploadPage from "../pages/UploadPage.jsx";
import SharePage from "../pages/SharePage.jsx";
import DownloadPage from "../pages/DownloadPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ForbiddenPage from "../pages/ForbiddenPage.jsx";
import SessionListPage from "../pages/SessionListPage.jsx";
import FacilitatePage from "../pages/FacilitatePage.jsx";
import ReviewPage from "../pages/ReviewPage.jsx";
import DiscussPage from "../pages/DiscussPage.jsx";

const CONNECTION_ISSUE_TIMEOUT = 2000;

const Fade = cssTransition({
    enter: "fadeIn",
    exit: "fadeOut",
    duration: [200, 0],
});

export default class App extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = { modal: { isOpen: false } };
    }

    renewSubscription = () => {
        const { user, sub } = this.props;
        if (user && !sub) {
            Session.set("subscription", { type: "user", _id: user._id });
        }
    };

    componentDidMount = () => {
        this.renewSubscription();
        setTimeout(() => {
            /* eslint-disable react/no-did-mount-set-state */
            this.setState({ showConnectionIssue: true });
        }, CONNECTION_ISSUE_TIMEOUT);
    };

    componentDidUpdate = () => {
        this.renewSubscription();
    };

    getSharedProps = () => {
        return {
            ...this.props,
            clearModal: this.clearModal,
            setModal: this.setModal,
        };
    };

    setModal = (m) => {
        this.setState({ modal: m });
    };

    clearModal = () => {
        this.setState({ modal: { isOpen: false } });
    };

    preRender = (match, Comp, pType) => {
        const shared = this.getSharedProps();
        if (pType == "user") {
            return (
                <UserContainer Comp={Comp} {...shared} id={Meteor.userId()} />
            );
        } else if (pType == "session") {
            return (
                <SessionContainer
                    Comp={Comp}
                    {...shared}
                    id={match.params.id}
                />
            );
        } else if (pType == "speaker") {
            return (
                <SpeakerContainer
                    Comp={Comp}
                    {...shared}
                    id={match.params.id}
                />
            );
        } else if (pType == "talk") {
            return (
                <TalkContainer Comp={Comp} {...shared} id={match.params.id} />
            );
        } else {
            return <NotFoundPage />;
        }
    };

    renderGuidePage = ({ match }) => {
        document.title = "SlideSpecs — Guide";
        return this.preRender(match, GuidePage, "user");
    };
    renderAboutPage = ({ match }) => {
        document.title = "SlideSpecs — About";
        return this.preRender(match, AboutPage, "user");
    };
    renderSessionList = ({ match }) => {
        document.title = "SlideSpecs — Home";
        return this.preRender(match, SessionListPage, "user");
    };

    renderSession = ({ match }) => {
        document.title = "SlideSpecs — Session";
        return this.preRender(match, SessionPage, "session");
    };
    renderShare = ({ match }) => {
        document.title = "SlideSpecs — Share";
        return this.preRender(match, SharePage, "session");
    };

    renderUpload = ({ match }) => {
        document.title = "SlideSpecs — Upload";
        return this.preRender(match, UploadPage, "speaker");
    };

    renderTalk = ({ match }) => {
        document.title = "SlideSpecs — Talk";
        return this.preRender(match, TalkPage, "talk");
    };
    renderComment = ({ match }) => {
        document.title = "SlideSpecs — Comment";
        return this.preRender(match, CommentPage, "talk");
    };
    renderFacilitate = ({ match }) => {
        document.title = "SlideSpecs — Facilitate";
        return this.preRender(match, FacilitatePage, "talk");
    };
    renderDiscuss = ({ match }) => {
        document.title = "SlideSpecs — Discuss";
        return this.preRender(match, DiscussPage, "talk");
    };
    renderReview = ({ match }) => {
        document.title = "SlideSpecs — Review";
        return this.preRender(match, ReviewPage, "talk");
    };
    renderDownload = ({ match }) => {
        document.title = "SlideSpecs — Download";
        return this.preRender(match, DownloadPage, "talk");
    };

    renderSecure = () => {
        if (
            location.protocol === "http:" &&
            location.hostname !== "localhost"
        ) {
            console.log("moving to https...");
            const secure = "https:" + window.location.href.substring(5);
            window.location.replace(secure);
        }
    };

    renderContent = ({ location }) => {
        this.renderSecure(); // http -> https
        const { modal } = this.state;
        const { loading } = this.props;
        const shared = this.getSharedProps();
        // const params = queryString.parse(location.search);

        return (
            <div id="container">
                <AppModal {...modal} />
                <ToastContainer
                    type="info"
                    transition={Fade}
                    closeButton={false}
                    hideProgressBar={true}
                    toastClassName="dark-toast"
                    position="top-right"
                    autoClose={2000}
                    pauseOnHover={false}
                />
                {loading ? (
                    <Loading key="loading" />
                ) : (
                    <Switch location={location}>
                        <Route
                            path="/signup"
                            component={AuthPageSignUp}
                            {...shared}
                        />
                        <Route
                            path="/login"
                            component={AuthPageSignIn}
                            {...shared}
                        />
                        <Route path="/guide" render={this.renderGuidePage} />
                        <Route path="/about" render={this.renderAboutPage} />
                        <Route path="/share/:id" render={this.renderShare} />
                        <Route path="/review/:id" render={this.renderReview} />
                        <Route
                            path="/comment/:id"
                            render={this.renderComment}
                        />
                        <Route
                            path="/discuss/:id"
                            render={this.renderDiscuss}
                        />
                        <Route
                            path="/download/:id"
                            render={this.renderDownload}
                        />
                        <PrivateRoute
                            exact
                            path="/"
                            render={this.renderSessionList}
                        />
                        <PrivateRoute
                            path="/sessions/:id"
                            render={this.renderSession}
                        />
                        <PrivateRoute
                            path="/upload/:id"
                            render={this.renderUpload}
                        />
                        <PrivateRoute
                            path="/slides/:id"
                            render={this.renderTalk}
                        />
                        <PrivateRoute
                            path="/facilitate/:id"
                            render={this.renderFacilitate}
                        />
                        <PrivateRoute
                            path="/review/:id"
                            render={this.renderReview}
                        />
                        <PrivateRoute render={() => <NotFoundPage />} />
                    </Switch>
                )}
            </div>
        );
    };

    showConnection = () => {
        const { showConnectionIssue } = this.state;
        const { connected } = this.props;
        if (showConnectionIssue && !connected) {
            toast(() => (
                <AppNotification
                    msg="connection issue"
                    desc="trying to reconnect..."
                    icon="refresh"
                />
            ));
        }
    };

    render() {
        return (
            <BrowserRouter>
                <Route render={this.renderContent} />
            </BrowserRouter>
        );
    }
}

const PrivateRoute = ({ render, ...other }) => {
    const user = Meteor.user();
    const matchId = other.computedMatch.params.id || "";
    let loc = window.location.pathname;
    let out;

    const sharedPaths = ["/", "/upload/:id"];
    const talkPermit = checkUserTalk.call({ matchId });
    const sessionPermit = checkUserSession.call({ matchId });
    const shared = sharedPaths.includes(other.path);
    const permitted = shared || talkPermit || sessionPermit;

    //console.log(Meteor.loggingIn(), user, other.path, matchId, loc);
    //console.log(saved, Meteor.loggingOut(), loc);
    // const saved = localStorage.getItem("feedbacks.referringLink");

    if (user && permitted) {
        out = render;
    } else if (!user && !Meteor.loggingOut()) {
        localStorage.setItem("feedbacks.referringLink", loc);
        out = () => (loc !== "/login" ? <Redirect to="/login" /> : null);
    } else if (!permitted) {
        out = () => <ForbiddenPage user={user} />;
    }

    return <Route {...other} render={out} />;
};

App.propTypes = {
    connected: PropTypes.bool.isRequired, // server connection status
    loading: PropTypes.bool.isRequired, // subscription status
    user: PropTypes.object, // current meteor user
    sessions: PropTypes.array,
    talks: PropTypes.array,
    comments: PropTypes.array,
    files: PropTypes.array,
    images: PropTypes.array,
};

App.defaultProps = {
    user: null,
    sessions: [],
    talks: [],
    comments: [],
    files: [],
    images: [],
};
