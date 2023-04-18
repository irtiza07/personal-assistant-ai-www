import React, { useState, useEffect } from "react";
import { Button, VStack, Center, Heading, Box, Text } from "@chakra-ui/react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [buttonText, setButtonText] = useState("Say Something");
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript);
    };

    setRecognitionInstance(recognition);
  }, []);

  const recordAudio = () => {
    setAnswer("");
    setButtonText("Recording...");
    setIsRecording(!isRecording);
    recognitionInstance.start();
  };

  const stopAudio = async () => {
    setButtonText("Say Something");
    setIsRecording(!isRecording);
    recognitionInstance.stop();

    const response = await fetch(
      `http://127.0.0.1:8000/answers?question=${transcript}`
    );
    const data = await response.json();
    setAnswer(data["answer"]);

    const utterance = new SpeechSynthesisUtterance(data["answer"]);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <Box
      bg="black"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="20px"
    >
      <Center>
        <VStack spacing={12}>
          <Heading color="red.500" fontSize="8xl">
            👋 I am your personal assistant 🤖
          </Heading>
          <Button
            colorScheme="red"
            width="300px"
            height="150px"
            onMouseOver={recordAudio}
            onMouseLeave={stopAudio}
            fontSize="3xl"
          >
            {buttonText}
          </Button>
          {transcript && (
            <Text color="whiteAlpha.500" fontSize="2xl">
              Question: {transcript}
            </Text>
          )}
          {answer && (
            <Text color="white" fontSize="3xl">
              <b>Answer:</b> {answer}
            </Text>
          )}
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
