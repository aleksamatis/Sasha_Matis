import React from 'react';
import './App.css';
import moment from 'moment';
import 'moment/locale/ru';
import humanizeDuration from 'humanize-duration';
moment.locale('ru');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          time: moment('2020-11-22'),
          name: 'День рождения Олега',
          shown: true,
        },
        {
          time: moment('2019-11-22'),
          name: 'Обед',
          shown: true,
        },
        {
          time: moment('2019-09-01'),
          name: 'Звонок по работе',
          shown: true,
        },
      ]
    };
    this.handleNewEventClick = this.handleNewEventClick.bind(this);

    this.nameInput = React.createRef();
    this.timeInput = React.createRef();
  }
  handleNewEventClick() {
    this.setState(state => {
      const newEvent = {
        time: moment(this.timeInput.current.value),
        name: this.nameInput.current.value,
        shown: false,
      };
      return {
        events: [...state.events, newEvent]
      };
    });
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      60 * 1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  markEventShown(idx) {
    this.setState(state => {
      const newState = [...state];
      newState.events[idx].shown = true;
      return newState;
    })
  }
  tick() {
    const now = moment();
    this.state.events.forEach((event, idx) => {
      if (!event.shown && event.time.isBefore(now)) {
        alert(event.name);
        this.markEventShown(idx);
      }
    });
    this.forceUpdate();
 }
  handleDeleteClick(idx) {
    this.setState(state => {
      const newEvents = [...state.events];
      newEvents.splice(idx, 1);
      return {
        events: newEvents
      };
    });
  }
  formatTime(event) {
    const now = moment();
    const d = now.diff(event.time);
    //event.time <= var now = moment() = a.diff(b) 
    //humanizeDuration(3000, { language: "es" }); 
    
    const shortRussianHumanizer = humanizeDuration.humanizer({
      language: "shortRu",
      languages: {
        shortRu: {
          y: () => "г",
          mo: () => "м",
          w: () => "нед",
          d: () => "д",
          h: () => "ч",
          m: () => "м",
          s: () => "с",
          ms: () => "мс",
        },
      },
    }); 

    return shortRussianHumanizer(d, { delimiter: " ", units: ['d', 'h', 'm'], round: true } );
  }
  render() {
    const events = this.state.events.map((event, idx)=>
    <div key={idx}>
      <div className="body border alignment-body">
        <div className="display-flex">
        <div>{this.formatTime(event)}</div>
        <div className="margin-left">{event.name}</div>
        </div>
        <div>
        <button className="btn" onClick={() => this.handleDeleteClick(idx)}>
          Удалить
        </button>
        </div>
      </div>
    </div>
    );
    return <div className="body-width">
      <div className="one">
        <div className="wrap">
        <div className="width">
          Событие
          <br />
          <input ref={this.nameInput} className="min-width"/>
        </div>
        <div className="widthpx">
          Время
          <br />
          <input type="datetime-local" ref={this.timeInput}/>
        </div>
        </div>
        <div className="margin-top">
          <button className="btn margin-right" onClick={this.handleNewEventClick}>
            Добавить
          </button>
        </div>
      </div>
      {events}
    </div>
  }
}

export default App;
