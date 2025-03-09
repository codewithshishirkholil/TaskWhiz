import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Linking, TextInput, Button } from 'react-native';
import { Text, useTheme, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
      const theme = useTheme();

      const openLink = (url: string) => {
            Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
      };
      const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
      const [feedback, setFeedback] = useState('');


      const handleSendFeedback = () => {
            const mailtoLink = `mailto:mahady1996hasan@gmail.com?subject=Feedback&body=${encodeURIComponent(feedback)}`;
            openLink(mailtoLink);
            setFeedback(''); // Clear feedback after sending
            setIsFeedbackOpen(false); // Close feedback input
      };

      return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                  <StatusBar barStyle={'dark-content'} />
                  <ScrollView contentContainerStyle={styles.scrollViewContent}>

                        {/* About App */}
                        <List.Section>
                              <List.Subheader>About This App</List.Subheader>
                              <List.Item
                                    title="App Name"
                                    description="TaskWhiz"
                              />
                              <List.Item
                                    title="Version"
                                    description="1.0.0"
                              />
                              <List.Item
                                    title="Developed By"
                                    description="FutureCode Studios"
                              />
                        </List.Section>

                        {/* Legal & Support */}
                        <List.Section>
                              <List.Subheader>Legal & Support</List.Subheader>
                              <List.Item
                                    title="Privacy Policy"
                                    description="Read how we handle your data"
                                    onPress={() => openLink('https://yourwebsite.com/privacy')}
                              />
                              <List.Item
                                    title="Terms & Conditions"
                                    description="View our terms of service"
                                    onPress={() => openLink('https://yourwebsite.com/terms')}
                              />

                        </List.Section>

                        {/* Feedback & Contribution */}
                        <List.Section>
                              <List.Subheader>Feedback</List.Subheader>
                              {!isFeedbackOpen ? (
                                    <List.Item
                                          title="Send Feedback"
                                          description="Share your experience and suggestions"
                                          onPress={() => setIsFeedbackOpen(true)}
                                    />
                              ) : (
                                    <View style={styles.feedbackContainer}>
                                          <TextInput
                                                style={styles.textArea}
                                                multiline
                                                numberOfLines={4}
                                                placeholder="Enter your feedback here"
                                                value={feedback}
                                                onChangeText={setFeedback}
                                          />
                                          <Button
                                                title="Send Feedback"
                                                onPress={handleSendFeedback}
                                          />

                                          <Button

                                                title="Cancel"
                                                onPress={() => setIsFeedbackOpen(false)}
                                          />
                                    </View>
                              )}
                        </List.Section>

                        {/* Contact Information */}
                        <List.Section>
                              <List.Subheader>Contact</List.Subheader>
                              <List.Item
                                    title="Email"
                                    description="mahady1996hasan@gmail.com"
                                    onPress={() => openLink('mailto:mahady1996hasan@gmail.com')}
                              />
                              <List.Item
                                    title="Phone"
                                    style={{
                                          marginBottom: 35,
                                    }}
                                    description="+88019611530035"
                                    onPress={() => openLink('tel:+88019611530035')}
                              />
                        </List.Section>
                  </ScrollView>
            </SafeAreaView>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
      },
      scrollViewContent: {
            padding: 16,
      },
      feedbackContainer: {
            marginTop: 16,
            display: 'flex',
            // need to gap
            gap: 10,
      },
      textArea: {
            height: 100,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 4,
            padding: 10,
            marginBottom: 10,
            textAlignVertical: 'top', // Keeps text at the top of the text area
      },
      cancel: {
            marginTop: 10,
      },
});
