import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [url, setUrl] = useState('https://www.youtube.com');
  const [messages, setMessages] = useState([
    { id: '1', text: '👋 Welcome to Couple Watch!', sender: 'System', time: '23:12' },
    { id: '2', text: '💡 Paste URL or click quick links', sender: 'System', time: '23:12' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [webviewKey, setWebviewKey] = useState(0);
  const scrollViewRef = useRef();

  const emojis = ['❤️', '😂', '😍', '🔥', '👏', '🎉', '😢', '🤔', '😎', '🙌'];

  const quickLinks = [
    { label: 'YouTube', url: 'https://www.youtube.com' },
    { label: 'Google', url: 'https://www.google.com' },
    { label: 'Netflix', url: 'https://www.netflix.com' },
    { label: 'Reddit', url: 'https://www.reddit.com' },
  ];

  const loadUrl = () => {
    if (!url.trim()) {
      Alert.alert('URL required', 'Please paste a URL');
      return;
    }

    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'https://' + url;
    }

    setUrl(fullUrl);
    setWebviewKey(webviewKey + 1);
    addSystemMessage(`📺 Loading: ${fullUrl.split('/')[2]}`);
  };

  const quickLoad = (selectedUrl) => {
    setUrl(selectedUrl);
    setWebviewKey(webviewKey + 1);
    addSystemMessage(`✅ Loaded: ${selectedUrl.split('/')[2]}`);
  };

  const addSystemMessage = (text) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setMessages([
      ...messages,
      {
        id: Math.random().toString(),
        text,
        sender: 'System',
        time,
      },
    ]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMessage = {
      id: Math.random().toString(),
      text: inputMessage,
      sender: 'You',
      time,
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate partner response
    setTimeout(() => {
      const responses = [
        'Bilkul! 😊',
        'Yeh scene kaafi acha tha! 🎬',
        'Hmm, interesting! 🤔',
        'Mujhe bhi pasand aya! 💕',
        'Haan haan! 👍',
        'Dekha? Perfect! ✨',
      ];

      const partnerMsg = {
        id: Math.random().toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'Asma',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isOwn: false,
      };

      setMessages((prev) => [...prev, partnerMsg]);
    }, 800 + Math.random() * 1200);
  };

  const sendEmoji = (emoji) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages([
      ...messages,
      {
        id: Math.random().toString(),
        text: `👍 ${emoji}`,
        sender: 'System',
        time,
      },
    ]);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.isOwn && styles.ownMessage,
        item.sender === 'System' && styles.systemMessage,
      ]}
    >
      {item.sender !== 'System' && (
        <Text style={styles.messageSender}>
          {item.sender} • {item.time}
        </Text>
      )}
      <Text
        style={[
          styles.messageText,
          item.isOwn && styles.ownText,
          item.sender === 'System' && styles.systemText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ec4899" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🎬 Couple Watch</Text>
          <Text style={styles.headerSubtitle}>Browse + Chat Together</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Video Area */}
        <View style={styles.videoContainer}>
          <WebView
            key={webviewKey}
            source={{ uri: url }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36"
          />
        </View>

        {/* URL Bar */}
        <View style={styles.urlBar}>
          <TextInput
            style={styles.urlInput}
            placeholder="Paste URL..."
            placeholderTextColor="#94a3b8"
            value={url}
            onChangeText={setUrl}
            onSubmitEditing={loadUrl}
          />
          <TouchableOpacity style={styles.loadBtn} onPress={loadUrl}>
            <Text style={styles.loadBtnText}>Load</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickLinksContainer}
        >
          {quickLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickLink}
              onPress={() => quickLoad(link.url)}
            >
              <Text style={styles.quickLinkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Section */}
      <View style={styles.chatContainer}>
        <Text style={styles.chatHeader}>💬 Together Chat</Text>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          ref={scrollViewRef}
        />

        {/* Emoji Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.emojisContainer}
        >
          {emojis.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emojiBtn}
              onPress={() => sendEmoji(emoji)}
            >
              <Text style={styles.emojiBtnText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#94a3b8"
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  urlBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#334155',
    color: '#f1f5f9',
    fontSize: 12,
  },
  loadBtn: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loadBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  quickLinksContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 40,
  },
  quickLink: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  quickLinkText: {
    color: '#f1f5f9',
    fontSize: 11,
    fontWeight: '500',
  },
  chatContainer: {
    height: height * 0.35,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  chatHeader: {
    backgroundColor: '#ec4899',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: '600',
    fontSize: 13,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageBubble: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
    maxWidth: '85%',
  },
  ownMessage: {
    backgroundColor: '#ec4899',
    marginLeft: 'auto',
    marginRight: 0,
  },
  systemMessage: {
    backgroundColor: 'transparent',
    maxWidth: '100%',
  },
  messageSender: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 2,
  },
  messageText: {
    color: '#f1f5f9',
    fontSize: 12,
  },
  ownText: {
    color: '#fff',
  },
  systemText: {
    color: '#94a3b8',
    textAlign: 'center',
  },
  emojisContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxHeight: 40,
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  emojiBtn: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBtnText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#334155',
    color: '#f1f5f9',
    fontSize: 12,
  },
  sendBtn: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default App;
