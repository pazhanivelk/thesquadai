import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export default class App extends React.Component {
  state = {
    messages: [],
    watsoninput:{
      input:"",
      messageContext: {
        global: {
          system: {
            turn_count: 1
          }
        },
        skills: {
          "main skill": {
            user_defined: {}
          }
        }
      },
    },


  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Welcome',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Watson Assistant',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
     
  
    }
   
  )
  }

  onSend(messages = []) {
    console.log("messages "+ messages);
    var watsonInput = {};
    this.setState(previousState => {
      watsonInput = previousState.watsoninput;
      watsonInput.input = messages[0].text;
      this.setState({
      messages: GiftedChat.append(previousState.messages, messages),
      watsoninput:watsonInput
    });
    
     this.connectWatson(messages, watsonInput);
    }
    );

   
  }

  

 connectWatson(messages, watsonInput) {
    console.log(messages[0]);
    console.log("input :" +JSON.stringify(
      watsonInput
    ));
    fetch("https://us-south.functions.cloud.ibm.com/api/v1/web/Paz%20Org_dev/default/inventoryapi.json?cache-bust=" + Date.now(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      watsonInput
      
    ),
  }).then((response) => (response.json()))
      .then((responseJson) => {
       
        console.log(  responseJson);
        var watsonresponse = responseJson.response;
        var sessionId = responseJson.sessionId;
        var messageContext = responseJson.messageContext;

       
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, {
              _id: Math.round(Math.random() * 1000000),
              text: watsonresponse,
              createdAt: new Date(),
              user:{
                _id:2,
                name:"Watson Assistant"
              },
            }),
            watsoninput:{
              input:"",
              sessionId:sessionId,
              messageContext:messageContext

            }
          }
      })
      

      })

 }
  

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
        
      />
    )
  }
}
