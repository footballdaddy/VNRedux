import { connect } from 'react-redux';
import App from './App';
import * as actions from './reducers/story';

const mapStateToProps = state => ({
  story: state.story,
});

export default connect(mapStateToProps, actions)(App);
