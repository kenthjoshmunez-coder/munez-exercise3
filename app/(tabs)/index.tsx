import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { questions } from "../../questions";

export default function App() {
  const [screen, setScreen] = useState<"home" | "quiz" | "result">("home");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);

  const current = questions[index];

  const selectAnswer = (choice: string) => {
    setAnswers({ ...answers, [current.id]: choice });
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setTimeLeft(90);
    } else {
      calculateScore();
      setScreen("result");
    }
  };

  const previous = () => {
    if (index > 0) {
      setIndex(index - 1);
      setTimeLeft(90);
    }
  };

  const calculateScore = () => {
    let s = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) s++;
    });
    setScore(s);
    if (s > highScore) setHighScore(s);
  };

  const startQuiz = () => {
    setIndex(0);
    setAnswers({});
    setScore(0);
    setTimeLeft(90);
    setScreen("quiz");
  };

  useEffect(() => {
    if (screen !== "quiz") return;

    if (timeLeft === 0) {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setTimeLeft(90);
      } else {
        calculateScore();
        setScreen("result");
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, screen, index]);

  if (screen === "home") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📘 Quiz App</Text>
        <TouchableOpacity style={styles.button} onPress={startQuiz}>
          <Text style={styles.btnText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "result") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Results</Text>
        <Text style={styles.scoreText}>Your Score: {score}</Text>
        <Text style={styles.scoreText}>Highest Score: {highScore}</Text>
        <TouchableOpacity style={styles.button} onPress={startQuiz}>
          <Text style={styles.btnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {index + 1} / {questions.length}
      </Text>

      <Text style={{ fontSize: 16, color: "red", marginBottom: 10 }}>
        Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </Text>

      <Text style={styles.question}>{current.question}</Text>

      {Object.keys(current.choices).map((key) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.choice,
            answers[current.id] === key && styles.selectedChoice,
          ]}
          onPress={() => selectAnswer(key)}
        >
          <Text style={styles.choiceText}>
            {key}. {current.choices[key as keyof typeof current.choices]}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.row}>
        <TouchableOpacity style={styles.smallBtn} onPress={previous}>
          <Text style={styles.smallBtnText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={next}>
          <Text style={styles.smallBtnText}>
            {index === questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 30,
  },
  progress: {
    fontSize: 14,
    color: "#5C6BC0",
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0D47A1",
    marginBottom: 20,
    textAlign: "center",
  },
  choice: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: "100%",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#BBDEFB",
    elevation: 2,
  },
  selectedChoice: {
    backgroundColor: "#BBDEFB",
    borderColor: "#1976D2",
  },
  choiceText: {
    fontSize: 16,
    color: "#1A237E",
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginTop: 25,
    width: "100%",
  },
  smallBtn: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  smallBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D47A1",
  },
  scoreText: {
    fontSize: 20,
    color: "#1A237E",
    marginVertical: 8,
  },
});
