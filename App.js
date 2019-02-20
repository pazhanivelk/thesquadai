import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export default class App extends React.Component {
  state = {
    messages: [],
    watsoninput:{
      input:""
      
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
        input:""
        
      },
  
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
    console.log(watsonInput)
     this.connectWatson(messages, watsonInput);
    }
    );

   
  }

  

 connectWatson(messages, watsonInput) {
    console.log(messages[0]);
    console.log("input " +JSON.stringify(
      watsonInput
    ));
    fetch("https://us-south.functions.cloud.ibm.com/api/v1/web/Paz%20Org_dev/default/inventoryapi.json", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      watsonInput
      
    ),
  }).then((response) => {

    var res = response.json();
    return res;
    })
      .then((responseJson) => {
        console.log(responseJson);


        var textFromResponse = getString(responseJson.output);
        console.log("text from getString" +textFromResponse);
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, {
              _id: Math.round(Math.random() * 1000000),
              text: textFromResponse,
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

function getString(obj){
  var returnStr = "";
  var generics= obj.generic;
  
  generics.forEach(function (response){
    console.log(response.response_type);
    if (response.response_type ==='option'){
        returnStr = returnStr + response.title +"\n";
        response.options.forEach(function(option, index){
          returnStr = returnStr + "\t" + index + " :" + option.value.input.text+"\n";
        });
    }
    if (response.response_type==='text'){
      returnStr = response.text;

      
    }
  });

  console.log("Return STr" +returnStr);
  return returnStr;
}