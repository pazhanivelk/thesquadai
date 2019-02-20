import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export default class App extends React.Component {
  state = {
    messages: [],
    watsoninput:{
      input:"",
      sessionId:"",
      messageContext:""
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
      watsoninput:{
        input:"",
        sessionId:"",
        messageContext:""
      },
  
    }
   
  )
  }

  onSend(messages = []) {
    console.log("messages "+ messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
      watsoninput:{
        input:messages[0].text,
        sessionId:previousState.sessionId,
        messageContext:previousState.messageContext
      }
    }));

    this.connectWatson(messages);
  }

  

 connectWatson(messages) {
    console.log(messages[0]);
    console.log(JSON.stringify({
      this.state.watsonInput,
      
    }));
    fetch("https://us-south.functions.cloud.ibm.com/api/v1/web/Paz%20Org_dev/default/inventoryapi.json", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      this.state.watsonInput,
      
    }),
  }).then((response) => {

    var res = response.json();
    
    return res;
    })
      .then((responseJson) => {
        console.log(responseJson);
        var text = responseJson.response;
        console.log(text);
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, {
              _id: Math.round(Math.random() * 1000000),
              text: text,
              createdAt: new Date(),
              user:{
                _id:2,
                name:"Watson Assistant"
              },
            }),
            watsonInput:{
              input:"",
              sessionId:responseJson.sessionId,
              messageContext:responseJson.messageContext

            }
          }
      })
      .catch((error) => {
        console.error(error);
      });

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