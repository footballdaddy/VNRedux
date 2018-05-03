// Dependencies
import React, { Component } from 'react';
import update from 'immutability-helper';
import Sound from 'react-sound';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// API
import novelFrames from './api/novelFrames';
import Choices from './api/Choices';
// Components
import TitleScreen from './components/TitleScreen';
import ChoiceMenu from './components/ChoiceMenu';
import RenderFrame from './components/RenderFrame';
import MenuButtons from './components/MenuButtons';
import SaveLoadMenu from './components/SaveLoadMenu';
// CSS
import './styles/App.css';
import './styles/TitleScreen.css';
import './styles/saveLoadMenu.css';

class App extends Component {
  /* ============================================================================================
       Diverges to different index depending on user's choice. Important function for VN writers
    ============================================================================================ */

  setFrameFromChoice(choice) {
    const updatedChoicesCount = [...this.props.story.route, choice];
    // Routes depending on choice
    this.props.setFrameFromChoice(updatedChoicesCount);
    // updatedChoicesCount
    // updatedChoicesCount[updatedChoicesCount.length - 1].includes
    if (updatedChoicesCount.includes('throwRock')) {
      this.setFrame(10);
    } else if (updatedChoicesCount.includes('noRock')) {
      this.setFrame(27);
    }
  }

  setNextFrame() {
    // Resume to title screen after testRoutes detours
    // Property does not have to be called testRoutesCompleted
    if (novelFrames[this.props.story.index].testRoutesCompleted) {
      this.setFrame(1);
    } else if (
      !this.props.story.choicesExist &&
      !this.props.story.loadMenuShown &&
      !this.props.story.saveMenuShown &&
      !this.props.story.titleScreenShown &&
      !this.props.story.backlogShown
    ) {
      this.setFrame(this.props.story.index + 1); // Normal functionality; goes to the next frame via index
    }
  }

  /* ===========================================================
       The rest are functionalities. VN writers can ignore rest
    =========================================================== */

  setFrame(index) {
    // Makes sure the index is within the novelFrames array
    if (index >= novelFrames.length) {
      index = novelFrames.length - 1;
    } else if (index <= -1) {
      index = 0;
    }
    // Updates novelFrames with new index
    this.props.setFrame(index);
  }

  // For developers to see what index they're editing. To request, set logIndex to true in novelFrames.js.
  componentDidMount() {
    for (var i = 0; i < novelFrames.length; i++) {
      if (novelFrames[i].logIndex) {
        console.log([i]);
      }
    }
  }

  renderFrame() {
    return (
      <RenderFrame
        setNextFrame={this.setNextFrame.bind(this)}
        bg={this.props.story.bg}
        sceneChange={this.props.story.sceneChange}
        sprite={this.props.story.sprite}
        speaker={this.props.story.speaker}
        text={this.props.story.text}
        textBoxShown={this.props.story.textBoxShown}
        index={this.props.story.index}
      />
    );
  }

  setNextChoice() {
    let choicesIndex = this.props.story.choicesIndex + 1;

    // Makes sure the index is within the Choices array
    if (choicesIndex >= Choices.length) {
      choicesIndex = Choices.length - 1;
    } else if (choicesIndex <= -1) {
      choicesIndex = 0;
    }

    this.props.setNextChoiceData(choicesIndex, Choices[choicesIndex].choices);
  }

  handleChoiceSelected(event) {
    this.stopSkip();
    this.setFrameFromChoice(event.currentTarget.name);
    this.setNextChoice();
  }

  renderChoiceMenu() {
    return (
      <ChoiceMenu
        choiceOptions={this.props.story.choiceOptions}
        onChoiceSelected={this.handleChoiceSelected.bind(this)}
      />
    );
  }

  toggleMenu() {
    this.props.toggleMenu();
  }

  toggleBacklog() {
    if (this.props.story.saveMenuShown) {
      this.props.toggleSaveMenuShown(false);
    }
    if (this.props.story.loadMenuShown) {
      this.props.toggleLoadMenuShown(false);
    }
    this.props.toggleBacklogShown(!this.props.story.backlogShown);
  }

  toggleTextBox() {
    this.props.toggleTextBox(!this.props.story.textBoxShown);
  }

  toggleSaveMenu() {
    if (this.props.story.loadMenuShown) {
      this.props.toggleLoadMenuShown(false);
    }
    if (this.props.story.backlogShown) {
      this.props.toggleBacklogShown(false);
    }
    this.props.toggleSaveMenuShown(!this.props.story.saveMenuShown);
  }

  toggleLoadMenu() {
    if (this.props.story.saveMenuShown) {
      this.props.story.toggleSaveMenuShown(false);
    }
    if (this.props.story.backlogShown) {
      this.props.toggleBacklogShown(false);
    }
    this.props.toggleLoadMenuShown(!this.props.story.loadMenuShown);
  }

  startSkip() {
    const intervalTime = prompt(
      'How many milliseconds per frame would you like?',
      '75',
    );
    if (intervalTime > 0) {
      this.props.toggleSkipping(true);
      this.textSkipper = setInterval(
        this.setNextFrame.bind(this),
        intervalTime,
      );
    }
  }

  stopSkip() {
    clearInterval(this.textSkipper);
    this.props.toggleSkipping(false);
  }

  // Saves and sets current state to local storage
  saveSlot(number) {
    localStorage.setItem('time' + number, new Date().toString()); // saves the current time to the save slot
    localStorage.setItem(
      number,
      JSON.stringify(this.state, (k, v) => (v === undefined ? null : v)),
    );
    this.setState(this.state);
  }

  // Loads and sets state from local storage
  loadSlot(number) {
    this.setState(JSON.parse(localStorage.getItem(number)));
    this.setState({
      saveMenuShown: false,
    }); // save menu to false and not load because save is true when saving
  }

  // "Begin" Button for title page.
  beginStory() {
    this.props.beginStory();
    this.setFrame(0);
    this.props.beginStory1(0, Choices[0].choices);
  }

  titleScreen() {
    return (
      <TitleScreen
        beginStory={this.beginStory.bind(this)}
        toggleLoadMenu={this.toggleLoadMenu.bind(this)}
      />
    );
  }

  saveMenu() {
    return (
      <SaveLoadMenu
        confirmationMessage="Overwrite save?"
        currentTime={this.props.story.currentTime}
        menuType="Save Menu"
        executeSlot={this.saveSlot.bind(this)}
        toggleMenu={this.toggleSaveMenu.bind(this)}
        speaker={this.props.story.speaker}
        text={this.props.story.text}
        textBoxShown={this.props.story.textBoxShown}
      />
    );
  }

  loadMenu() {
    return (
      <SaveLoadMenu
        confirmationMessage="Load save?"
        currentTime={this.props.story.currentTime}
        menuType="Load Menu"
        executeSlot={this.loadSlot.bind(this)}
        toggleMenu={this.toggleLoadMenu.bind(this)}
        speaker={this.props.story.speaker}
        text={this.props.story.text}
        textBoxShown={this.props.story.textBoxShown}
      />
    );
  }

  // the GUI interface on the bottom
  renderMenuButtons() {
    if (!this.props.story.buttonsDeleted) {
      return (
        <MenuButtons
          deleteButtons={() => this.props.toggleDeleteButtons(true)}
          menuButtonsShown={this.props.story.menuButtonsShown}
          toggleSaveMenu={this.toggleSaveMenu.bind(this)}
          toggleLoadMenu={this.toggleLoadMenu.bind(this)}
          saveSlot={this.saveSlot.bind(this)}
          loadSlot={this.loadSlot.bind(this)}
          saveMenuShown={this.props.story.saveMenuShown}
          loadMenuShown={this.props.story.loadMenuShown}
          toggleMenu={this.toggleMenu.bind(this)}
          toggleBacklog={this.toggleBacklog.bind(this)}
          toggleTextBox={this.toggleTextBox.bind(this)}
          startSkip={this.startSkip.bind(this)}
          stopSkip={this.stopSkip.bind(this)}
          isSkipping={this.props.story.isSkipping}
          textBoxShown={this.props.story.textBoxShown}
          backlogShown={this.props.story.backlogShown}
        />
      );
    }
  }

  backlog() {
    let loggedText = [];
    for (var i = 0; i < this.props.story.indexHistory.length; i++) {
      loggedText.unshift(
        <div className="backlog" key={loggedText.toString()}>
          <div className="backlog-speaker">
            {novelFrames[this.props.story.indexHistory[i]].speaker}
          </div>
          {novelFrames[this.props.story.indexHistory[i]].text}
        </div>,
      );
    }

    return <div className="overlay backlog-overlay">{loggedText}</div>;
  }
  playBGM() {
    return (
      <Sound
        url={this.props.story.bgm}
        playStatus={Sound.status.PLAYING}
        loop="true"
      />
    );
  }
  playSound() {
    return (
      <Sound url={this.props.story.sound} playStatus={Sound.status.PLAYING} />
    );
  }
  playVoice() {
    return (
      <Sound url={this.props.story.voice} playStatus={Sound.status.PLAYING} />
    );
  }

  render() {
    return (
      <div>
        <ReactCSSTransitionGroup
          component="div"
          className="container"
          transitionName="menu"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.props.story.titleScreenShown ? this.titleScreen() : null}
          {this.props.story.frameIsRendering ? this.renderFrame() : null}
          {/* GUI menu buttons */}
          {this.props.story.saveMenuShown ? this.saveMenu() : null}
          {this.props.story.loadMenuShown ? this.loadMenu() : null}
          {this.props.story.backlogShown ? this.backlog() : null}
          {/* {this.props.story.frameIsRendering ? this.renderFrame() : null} */}
          {this.props.story.choicesExist ? this.renderChoiceMenu() : null}
        </ReactCSSTransitionGroup>
        {!this.props.story.titleScreenShown ? this.renderMenuButtons() : null}
        {this.playBGM()}
        {this.playSound()}
        {this.playVoice()}
      </div>
    );
  }
}

export default App;
