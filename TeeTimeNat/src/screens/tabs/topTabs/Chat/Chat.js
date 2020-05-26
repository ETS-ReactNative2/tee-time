import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { Input, Button, Text, ListItem } from "react-native-elements";
import axios from "axios";
import io from "socket.io-client";
import style from "./stylesheet.scss";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: true,
      chatMessage: "",
      chatMessages: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitChatMessage = this.submitChatMessage.bind(this);
  }

  componentDidMount() {
    const userData = this.props.userData;

    axios
      .put("http://192.168.138.2:7777/api/match/current/getChat", { userData })
      .then(res => {
        console.log("chat data res", res.data);
        const chatMessages = res.data[0].chat;
        this.setState({ chatMessages });
      });
    this.socket = io("http://192.168.138.2:7777");
    this.socket.on("connect", () => console.log("connected"));
    this.socket.on("chat message", msg => {
      axios
        .put("http://192.168.138.2:7777/api/match/current/getChat", {
          userData
        })
        .then(res => {
          const chatMessages = res.data[0].chat;
          this.setState({ chatMessages });
        });
    });
  }

  handleChange(event) {
    this.setState({
      chatMessage: event
    });
    console.log(this.state.chatMessage);
  }

  submitChatMessage() {
    const userData = this.props.userData;
    const chatMessage = this.state.chatMessage;
    const chatMessageObj = {
      message: this.state.chatMessage,
      messager: userData.username,
      messagerId: userData._id
    };

    axios
      .post("http://192.168.138.2:7777/api/match/current/saveChatMessage", {
        userData,
        chatMessage
      })
      .then(res => {
        this.socket.emit("chat message", this.state.chatMessage);
        this.setState({
          chatMessages: [...this.state.chatMessages, chatMessageObj]
        });
        this.setState({ chatMessage: "" });
      });
  }

  handleUserChange() {
    const lastMsgObj = this.state.chatMessages.pop();
    const user = lastMsgObj.messager;
    if (user === this.props.userData.username) {
      this.setState({ user: true });
    } else {
      this.setState({ user: false });
    }
  }

  render() {
    console.log(this.state.chatMessages);
    return (
      <View style={style} id="chat-container">
        <ScrollView
          id="msg-container"
          style={{
            borderWidth: 1,
            borderColor: "red",
            height: "70%"
          }}
        >
          <View className={this.state.user ? "user-msgs" : "friend-msgs"}>
            {this.state.chatMessages.map((chatMessage, i) => (
              <ListItem key={i} className="message">
                <Text key={chatMessage._id} style={{ color: "black" }}>
                  {chatMessage.messager}
                </Text>
                <Text key={chatMessage.messagerId}>{chatMessage.message}</Text>
              </ListItem>
            ))}
          </View>
        </ScrollView>
        <View id="input-container" style={{ justifyContent: "flex-end" }}>
          <Input
            type="text"
            id="chat-input"
            placeholder="Type your message here..."
            onChangeText={this.handleChange}
          />
          <Button
            onPress={this.submitChatMessage}
            title={"Send Message"}
            id="send-btn"
          />
        </View>
      </View>
    );
  }
}
