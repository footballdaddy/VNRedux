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
    const updatedChoicesCount = update(this.props.choicesCount, {
      [choice]: { $apply: currentValue => currentValue + 1 },
    });
    // Routes depending on choice
    if (updatedChoicesCount.throwRock === 1) {
      this.setFrame(10);
    } else if (updatedChoicesCount.noRock === 1) {
      this.setFrame(27);
    }
    this.props.setFrameFromChoice(updatedChoicesCount);
  }

  setNextFrame() {
    // Resume to title screen after testRoutes detours
    // Property does not have to be called testRoutesCompleted
    if (novelFrames[this.props.index].testRoutesCompleted) {
      this.setFrame(1);
    } else if (
      !this.props.choicesExist &&
      !this.props.loadMenuShown &&
      !this.props.saveMenuShown &&
      !this.props.titleScreenShown &&
      !this.props.backlogShown
    ) {
      this.setFrame(this.props.index + 1); // Normal functionality; goes to the next frame via index
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

  // componentDidUpdate(prevProps, prevState) {
  //   // Update indexHistory if index changed
  //   if (prevState.index !== this.state.index) {
  //     this.setState({
  //       indexHistory: [...this.state.indexHistory, prevState.index]
  //     });
  //   }
  // }

  renderFrame() {
    return (
      <RenderFrame
        setNextFrame={this.setNextFrame.bind(this)}
        bg={this.props.bg}
        sceneChange={this.props.sceneChange}
        sprite={this.props.sprite}
        speaker={this.props.speaker}
        text={this.props.text}
        textBoxShown={this.props.textBoxShown}
      />
    );
  }

  setNextChoice() {
    let choicesIndex = this.props.choicesIndex + 1;

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
        choiceOptions={this.props.choiceOptions}
        onChoiceSelected={this.handleChoiceSelected.bind(this)}
      />
    );
  }

  toggleMenu() {
    this.props.toggleMenu();
  }

  toggleBacklog() {
    if (this.props.saveMenuShown) {
      this.props.toggleSaveMenuShown(false);
    }
    if (this.props.loadMenuShown) {
      this.props.toggleLoadMenuShown(false);
    }
    this.props.toggleBacklogShown(!this.props.backlogShown);
  }

  toggleTextBox() {
    this.props.toggleTextBox(!this.props.textBoxShown);
  }

  toggleSaveMenu() {
    if (this.props.loadMenuShown) {
      this.props.toggleLoadMenuShown(false);
    }
    if (this.props.backlogShown) {
      this.props.toggleBacklogShown(false);
    }
    this.props.toggleSaveMenuShown(!this.props.saveMenuShown);
  }

  toggleLoadMenu() {
    if (this.props.saveMenuShown) {
      this.props.toggleSaveMenuShown(false);
    }
    if (this.props.backlogShown) {
      this.props.toggleBacklogShown(false);
    }
    this.props.toggleLoadMenuShown(!this.props.loadMenuShown);
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

    this.props.setNextChoiceData(
      this.props.choicesIndex,
      Choices[this.props.choicesIndex].choices,
    );
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
        currentTime={this.props.currentTime}
        menuType="Save Menu"
        executeSlot={this.saveSlot.bind(this)}
        toggleMenu={this.toggleSaveMenu.bind(this)}
        speaker={this.props.speaker}
        text={this.props.text}
        textBoxShown={this.props.textBoxShown}
      />
    );
  }

  loadMenu() {
    return (
      <SaveLoadMenu
        confirmationMessage="Load save?"
        currentTime={this.props.currentTime}
        menuType="Load Menu"
        executeSlot={this.loadSlot.bind(this)}
        toggleMenu={this.toggleLoadMenu.bind(this)}
        speaker={this.props.speaker}
        text={this.props.text}
        textBoxShown={this.props.textBoxShown}
      />
    );
  }

  // the GUI interface on the bottom
  renderMenuButtons() {
    if (!this.props.buttonsDeleted) {
      return (
        <MenuButtons
          deleteButtons={() => this.props.toggleDeleteButtons(true)}
          menuButtonsShown={this.props.menuButtonsShown}
          toggleSaveMenu={this.toggleSaveMenu.bind(this)}
          toggleLoadMenu={this.toggleLoadMenu.bind(this)}
          saveSlot={this.saveSlot.bind(this)}
          loadSlot={this.loadSlot.bind(this)}
          saveMenuShown={this.props.saveMenuShown}
          loadMenuShown={this.props.loadMenuShown}
          toggleMenu={this.toggleMenu.bind(this)}
          toggleBacklog={this.toggleBacklog.bind(this)}
          toggleTextBox={this.toggleTextBox.bind(this)}
          startSkip={this.startSkip.bind(this)}
          stopSkip={this.stopSkip.bind(this)}
          isSkipping={this.props.isSkipping}
          textBoxShown={this.props.textBoxShown}
          backlogShown={this.props.backlogShown}
        />
      );
    }
  }

  backlog() {
    let loggedText = [];
    for (var i = 0; i < this.props.indexHistory.length; i++) {
      loggedText.unshift(
        <div className="backlog" key={loggedText.toString()}>
          <div className="backlog-speaker">
            {novelFrames[this.props.indexHistory[i]].speaker}
          </div>
          {novelFrames[this.props.indexHistory[i]].text}
        </div>,
      );
    }

    return <div className="overlay backlog-overlay">{loggedText}</div>;
  }
  playBGM() {
    return (
      <Sound
        url={this.props.bgm}
        playStatus={Sound.status.PLAYING}
        loop="true"
      />
    );
  }
  playSound() {
    return <Sound url={this.props.sound} playStatus={Sound.status.PLAYING} />;
  }
  playVoice() {
    return <Sound url={this.props.voice} playStatus={Sound.status.PLAYING} />;
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
          {this.props.titleScreenShown ? this.titleScreen() : null}
          {this.props.frameIsRendering ? this.renderFrame() : null}
          {/* GUI menu buttons */}
          {this.props.saveMenuShown ? this.saveMenu() : null}
          {this.props.loadMenuShown ? this.loadMenu() : null}
          {this.props.backlogShown ? this.backlog() : null}
          {this.props.frameIsRendering ? this.renderFrame() : null}
          {this.props.choicesExist ? this.renderChoiceMenu() : null}
        </ReactCSSTransitionGroup>
        {!this.props.titleScreenShown ? this.renderMenuButtons() : null}
        {this.playBGM()}
        {this.playSound()}
        {this.playVoice()}
      </div>
    );
  }
}

export default App;
