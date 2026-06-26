"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense, useRef } from "react";
import type { FormEvent } from "react";

import { useAuth } from "@/components/auth-provider";
import { api, getApiErrorMessage } from "@/lib/api";
import { Avatar, Card, Icon } from "@/components/interview-ai";

type InterviewDocument = {
  _id: string;
  role: string;
  experience: string;
  difficulty: string;
  interviewType: string;
  totalQuestions: number;
  status: "in_progress" | "completed" | "abandoned";
  overallScore: number | null;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  roleReadiness: "not_ready" | "almost" | "ready" | null;
  startedAt?: string;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ResponseDocument = {
  _id: string;
  answerText: string;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  clarityScore: number;
  overallScore: number;
  feedback: string;
  improvedAnswer: string;
  audioUrl?: string | null;
  submittedAt?: string;
};

type QuestionDocument = {
  _id: string;
  questionNumber: number;
  text: string;
  type: string;
  category: string;
  response: ResponseDocument | null;
};

type SessionSummary = {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  roleReadiness: "not_ready" | "almost" | "ready" | null;
};

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

function RecordingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const interviewId = searchParams.get("interviewId");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interview, setInterview] = useState<InterviewDocument | null>(null);
  const [questions, setQuestions] = useState<QuestionDocument[]>([]);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Audio recording states
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const displayName = `${user?.firstName || "Alex"} ${user?.lastName || "Rivera"}`.trim();
  const displayRole = interview?.role || "Software Engineering Role";
  const sessionProgress = useMemo(
    () => (questions.length ? `${currentIndex + 1} of ${questions.length}` : "0 of 0"),
    [currentIndex, questions.length],
  );

  const responseMap = useMemo(() => {
    return Object.fromEntries(
      questions.map((question) => [question._id, question.response ?? null]),
    ) as Record<string, ResponseDocument | null>;
  }, [questions]);

  const currentQuestion = questions[currentIndex] ?? null;
  const currentAnswer = currentQuestion ? draftAnswers[currentQuestion._id] ?? currentQuestion.response?.answerText ?? "" : "";
  const currentResponse = currentQuestion ? responseMap[currentQuestion._id] : null;

  // Global session timer
  useEffect(() => {
    if (!interviewId || loading || !interview || interview.status === "completed") {
      return undefined;
    }

    setElapsedSeconds(0);
    const startTime = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(startTime);
  }, [interviewId, loading, interview]);

  // Audio recording elapsed timer
  useEffect(() => {
    let interval: number;
    if (recording) {
      setRecordingSeconds(0);
      interval = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    let active = true;

    const loadInterview = async () => {
      if (!interviewId) {
        setLoading(false);
        setError("Missing interview session id.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get(`/interviews/${interviewId}`);
        if (!active) {
          return;
        }

        const loadedInterview: InterviewDocument = data.interview;
        const loadedQuestions: QuestionDocument[] = data.questions ?? [];

        setInterview(loadedInterview);
        setQuestions(loadedQuestions);
        setDraftAnswers(
          loadedQuestions.reduce<Record<string, string>>((accumulator, question) => {
            accumulator[question._id] = question.response?.answerText || "";
            return accumulator;
          }, {}),
        );
        setCurrentIndex(
          Math.max(
            0,
            loadedQuestions.findIndex((question) => !question.response?.answerText || question.response.answerText.trim().length === 0),
          ),
        );

        if (loadedInterview.status === "completed") {
          setSessionSummary({
            overallScore: loadedInterview.overallScore ?? 0,
            summary: loadedInterview.summary || "",
            strengths: loadedInterview.strengths || [],
            weaknesses: loadedInterview.weaknesses || [],
            recommendations: loadedInterview.recommendations || [],
            roleReadiness: loadedInterview.roleReadiness ?? null,
          });
        }
      } catch (fetchError) {
        if (!active) {
          return;
        }
        setError(getApiErrorMessage(fetchError, "Unable to load interview session"));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadInterview();

    return () => {
      active = false;
    };
  }, [interviewId]);

  // Audio Recording Handlers
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await uploadAudioResponse(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied or not supported in this browser.");
    }
  };

  const stopAndSubmitRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      audioChunksRef.current = [];
    }
  };

  const uploadAudioResponse = async (blob: Blob) => {
    if (!currentQuestion) return;

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("questionId", currentQuestion._id);
    formData.append("audio", blob, "recording.webm");

    try {
      const { data } = await api.post("/responses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const savedResponse: ResponseDocument = data.response;

      setQuestions((currentQuestions) =>
        currentQuestions.map((question) =>
          question._id === currentQuestion._id
            ? {
                ...question,
                response: savedResponse,
              }
            : question,
        ),
      );
      setDraftAnswers((currentDrafts) => ({
        ...currentDrafts,
        [currentQuestion._id]: savedResponse.answerText,
      }));

      const nextIndex = Math.min(currentIndex + 1, Math.max(questions.length - 1, 0));
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(nextIndex);
      } else {
        await completeInterview();
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to transcribe or evaluate your audio. Please speak clearly."));
    } finally {
      setSubmitting(false);
    }
  };

  // Text response handlers
  const saveTextResponse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentQuestion || interview?.status === "completed") {
      return;
    }

    const answer = (draftAnswers[currentQuestion._id] || "").trim();
    if (!answer) {
      setError("Please type an answer before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data } = await api.post("/responses", {
        questionId: currentQuestion._id,
        answer,
      });

      const savedResponse: ResponseDocument = data.response;

      setQuestions((currentQuestions) =>
        currentQuestions.map((question) =>
          question._id === currentQuestion._id
            ? {
                ...question,
                response: savedResponse,
              }
            : question,
        ),
      );
      setDraftAnswers((currentDrafts) => ({
        ...currentDrafts,
        [currentQuestion._id]: answer,
      }));

      const nextIndex = Math.min(currentIndex + 1, Math.max(questions.length - 1, 0));
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(nextIndex);
      } else {
        await completeInterview();
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to save your response"));
    } finally {
      setSubmitting(false);
    }
  };

  const completeInterview = async () => {
    if (!interviewId) {
      return;
    }

    setCompleting(true);
    try {
      const { data } = await api.post(`/interviews/${interviewId}/complete`);
      const completedInterview: InterviewDocument = data.interview;

      setInterview(completedInterview);
      setSessionSummary({
        overallScore: data.overallScore ?? completedInterview.overallScore ?? 0,
        summary: data.summary ?? completedInterview.summary ?? "",
        strengths: data.strengths ?? completedInterview.strengths ?? [],
        weaknesses: data.weaknesses ?? completedInterview.weaknesses ?? [],
        recommendations: data.recommendations ?? completedInterview.recommendations ?? [],
        roleReadiness: data.roleReadiness ?? completedInterview.roleReadiness ?? null,
      });

      router.push(`/interviews/results?interviewId=${interviewId}`);
    } catch (completeError) {
      setError(getApiErrorMessage(completeError, "Unable to finalize the interview"));
    } finally {
      setCompleting(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setError(null);
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((value) => Math.min(value + 1, questions.length - 1));
      setError(null);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((value) => Math.max(value - 1, 0));
      setError(null);
    }
  };

  const answeredCount = questions.filter((question) => Boolean(question.response?.answerText)).length;

  if (!interviewId) {
    return (
      <div className="min-h-screen bg-[#121316] px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <h1 className="text-[2.3rem] font-semibold tracking-tight">Missing interview session</h1>
          <p className="mt-4 text-[1.05rem] leading-8 text-white/70">
            We could not find a session id in the URL.
          </p>
          <Link
            href="/interviews"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#4f46e5,#3730a3)] px-6 py-3 text-[1rem] font-medium text-white"
          >
            Back to setup
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(36,40,54,0.35),_transparent_30%),linear-gradient(180deg,#121316_0%,#181b1f_100%)] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <Card className="border-white/10 bg-white/5 px-8 py-10 text-center text-white shadow-none ring-white/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <Icon name="sparkles" className="h-7 w-7 text-[#a8a3ff]" />
            </div>
            <p className="mt-5 text-[1.05rem] uppercase tracking-[0.32em] text-white/55">Loading session</p>
            <p className="mt-4 text-[1.3rem] text-white/85">Pulling your questions and response history...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(36,40,54,0.35),_transparent_30%),linear-gradient(180deg,#121316_0%,#181b1f_100%)] px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <h1 className="text-[2.3rem] font-semibold tracking-tight">Could not load interview</h1>
          <p className="mt-4 text-[1.05rem] leading-8 text-white/70">{error}</p>
          <Link
            href="/interviews"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#4f46e5,#3730a3)] px-6 py-3 text-[1rem] font-medium text-white"
          >
            Back to setup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_35%),linear-gradient(180deg,#0f111a_0%,#07080d_100%)] text-white font-sans">
      <div className="relative min-h-screen px-5 py-6 pb-36 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/40 px-5 py-3 text-[1rem] font-semibold tracking-[0.22em] text-white/90 backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[0.88rem] uppercase tracking-[0.18em]">Live Session</span>
            <Icon name="microphone" className="h-5 w-5 text-white/80" />
          </div>

          <Card className="border-white/10 bg-slate-900/30 px-6 py-4 text-center text-white shadow-none ring-white/5 backdrop-blur-md">
            <p className="text-[0.78rem] uppercase tracking-[0.2em] text-white/50 font-bold">Session Time</p>
            <div className="mt-1 text-[2.5rem] font-bold leading-none tracking-tight">{formatTime(elapsedSeconds)}</div>
          </Card>

          <button type="button" className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-slate-900/30 text-white/80 backdrop-blur-md hover:bg-slate-900/50 hover:text-white transition">
            <Icon name="settings" className="h-6 w-6" />
          </button>
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-15rem)] max-w-6xl flex-col items-center justify-center px-4 py-10 text-center">
          <p className="text-[0.78rem] uppercase tracking-[0.42em] text-white/40 font-bold">
            Question {sessionProgress}
          </p>
          <h1 className="mt-6 max-w-4xl text-balance text-[1.8rem] font-bold leading-[1.4] tracking-tight text-white sm:text-[2.2rem]">
            {currentQuestion?.text}
          </h1>

          {/* Glowing waveform only showing when recording */}
          {recording && (
            <div className="mt-10 flex items-end justify-center gap-2.5 h-[50px]">
              {[32, 58, 44, 76, 52, 88, 64, 40, 68, 30].map((height, index) => (
                <div
                  key={index}
                  className="w-2.5 rounded-full bg-indigo-500 animate-pulse"
                  style={{
                    height: `${Math.max(10, Math.sin(recordingSeconds + index) * height + 40)}px`,
                    animationDelay: `${index * 120}ms`,
                  }}
                />
              ))}
            </div>
          )}

          <Card className="mt-10 w-full max-w-4xl border-white/10 bg-slate-900/40 p-6 text-left text-white shadow-xl ring-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/40 font-bold">
                  {inputMode === "voice" ? "Voice Response Mode" : "Keyboard Text Mode"}
                </p>
                <h2 className="mt-1 text-[1.25rem] font-bold">{currentQuestion?.category}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInputMode(inputMode === "voice" ? "text" : "voice")}
                  disabled={recording || submitting || completing}
                  className="rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-[0.78rem] font-bold tracking-wider uppercase text-white/80 transition disabled:opacity-40"
                >
                  {inputMode === "voice" ? "Switch to keyboard" : "Switch to micro"}
                </button>
                <div className="rounded-full bg-white/10 px-4 py-1.5 text-[0.88rem] font-semibold text-white/80">
                  {answeredCount}/{questions.length} answered
                </div>
              </div>
            </div>

            {inputMode === "voice" ? (
              // Voice Recording Mode UI
              <div className="mt-6 flex flex-col items-center justify-center py-6 text-center space-y-6">
                {submitting ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-[1.05rem] font-semibold text-indigo-300">AI is transcribing and evaluating your answer...</p>
                  </div>
                ) : recording ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-[2.2rem] font-bold text-red-400 font-mono tracking-wider animate-pulse">
                      {formatTime(recordingSeconds)}
                    </div>
                    <p className="text-white/60 text-[0.95rem]">Speak clearly. Click Stop to transcribe and submit.</p>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={stopAndSubmitRecording}
                        className="flex items-center gap-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-8 py-4 text-[1.1rem] font-bold text-white shadow-lg shadow-red-500/20 hover:scale-[1.02] transition active:scale-100"
                      >
                        <span className="h-3 w-3 rounded-full bg-white animate-ping" />
                        Stop & Submit
                      </button>
                      <button
                        type="button"
                        onClick={cancelRecording}
                        className="rounded-full bg-white/10 hover:bg-white/20 px-5 py-4 text-[0.95rem] font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={submitting || completing || interview?.status === "completed"}
                      className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.05] transition active:scale-100 disabled:opacity-50"
                    >
                      <Icon name="microphone" className="h-10 w-10" />
                    </button>
                    <p className="text-[1.1rem] font-bold">Click to start recording your response</p>
                    <p className="text-white/50 text-[0.88rem]">Your microphone will capture your audio answer.</p>
                  </div>
                )}

                {error ? (
                  <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[0.9rem] leading-6 text-red-200" role="alert">
                    {error}
                  </div>
                ) : null}

                <div className="w-full flex items-center justify-between border-t border-white/10 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={goToPreviousQuestion}
                    disabled={currentIndex === 0 || submitting || completing || recording}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[1rem] text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon name="arrow-left" className="h-5 w-5" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNextQuestion}
                    disabled={currentIndex === questions.length - 1 || submitting || completing || recording}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[1rem] text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <Icon name="arrow-right" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              // Text Input fallback UI
              <form className="mt-5 space-y-4" onSubmit={saveTextResponse}>
                <textarea
                  value={currentAnswer}
                  onChange={(event) => {
                    if (!currentQuestion) {
                      return;
                    }
                    setDraftAnswers((currentDrafts) => ({
                      ...currentDrafts,
                      [currentQuestion._id]: event.target.value,
                    }));
                    setError(null);
                  }}
                  placeholder="Type your answer here..."
                  className="min-h-[180px] w-full rounded-[20px] border border-white/10 bg-black/30 px-5 py-4 text-[1rem] leading-8 text-white outline-none placeholder:text-white/30 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 text-[0.88rem] text-white/40 font-medium">
                  <span>Keep it structured, concise, and specific.</span>
                  <span>{(currentAnswer || "").trim().length} characters</span>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[0.9rem] leading-6 text-red-200" role="alert">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousQuestion}
                    disabled={currentIndex === 0 || submitting || completing}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[1rem] text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon name="arrow-left" className="h-5 w-5" />
                    Previous
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || completing || interview?.status === "completed" || !currentAnswer.trim()}
                    className="inline-flex items-center justify-center gap-4 rounded-[28px] bg-gradient-to-r from-indigo-500 to-violet-600 px-10 py-5 text-[1.15rem] font-bold text-white shadow-md shadow-indigo-500/15 transition hover:translate-y-[-1px] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : currentIndex === questions.length - 1 ? "Finish Interview" : "Submit Answer"}
                  </button>

                  <button
                    type="button"
                    onClick={goToNextQuestion}
                    disabled={currentIndex === questions.length - 1 || submitting || completing}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[1rem] text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <Icon name="arrow-right" className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}
          </Card>

          {currentResponse ? (
            <Card className="mt-6 w-full max-w-4xl border-white/10 bg-slate-900/40 p-6 text-left text-white shadow-xl ring-white/5 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/40 font-bold">AI Evaluation</p>
                  <h2 className="mt-1 text-[1.3rem] font-bold">Response scored {currentResponse.overallScore}/10</h2>
                </div>
                <div className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-[0.88rem] font-semibold text-indigo-300">
                  Technical {currentResponse.technicalScore}/10 · Communication {currentResponse.communicationScore}/10
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-[20px] border border-white/5 bg-black/25 p-5 shadow-inner">
                  <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/40 font-bold">Feedback</p>
                  <p className="mt-3 text-[0.98rem] leading-8 text-white/80">{currentResponse.feedback}</p>
                </div>
                <div className="rounded-[20px] border border-white/5 bg-black/25 p-5 shadow-inner">
                  <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/40 font-bold">Improved Answer</p>
                  <p className="mt-3 whitespace-pre-line text-[0.98rem] leading-8 text-white/80">
                    {currentResponse.improvedAnswer}
                  </p>
                </div>
              </div>
            </Card>
          ) : null}

          {sessionSummary ? (
            <Card className="mt-6 w-full max-w-4xl border-0 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-left text-white shadow-xl shadow-indigo-500/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/60 font-bold">Interview Complete</p>
                  <h2 className="mt-1 text-[1.5rem] font-bold">Overall score: {sessionSummary.overallScore}/100</h2>
                </div>
                {sessionSummary.roleReadiness ? (
                  <div className="rounded-full bg-white/15 px-4 py-2 text-[0.88rem] font-semibold capitalize text-white/90">
                    {sessionSummary.roleReadiness.replaceAll("_", " ")}
                  </div>
                ) : null}
              </div>

              <p className="mt-5 max-w-4xl text-[1rem] leading-8 text-white/90">{sessionSummary.summary}</p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div className="rounded-[20px] bg-white/5 border border-white/10 p-5">
                  <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/50 font-bold">Strengths</p>
                  <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 text-white/85">
                    {sessionSummary.strengths.map((item) => (
                      <li key={item} className="list-none">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[20px] bg-white/5 border border-white/10 p-5">
                  <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/50 font-bold">Weaknesses</p>
                  <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 text-white/85">
                    {sessionSummary.weaknesses.map((item) => (
                      <li key={item} className="list-none">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[20px] bg-white/5 border border-white/10 p-5">
                  <p className="text-[0.75rem] uppercase tracking-[0.28em] text-white/50 font-bold">Recommendations</p>
                  <ul className="mt-4 space-y-2 text-[0.95rem] leading-7 text-white/85">
                    {sessionSummary.recommendations.map((item) => (
                      <li key={item} className="list-none">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {questions.map((question, index) => {
              const answered = Boolean(question.response?.answerText);
              const active = index === currentIndex;

              return (
                <button
                  key={question._id}
                  type="button"
                  onClick={() => goToQuestion(index)}
                  disabled={recording || submitting || completing}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-[0.95rem] font-medium transition ${
                    active
                      ? "bg-white text-[#191b26]"
                      : answered
                        ? "bg-[#4f46e5] text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/15"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:bottom-8">
          <Card className="flex items-center gap-4 border-white/12 bg-white/5 px-5 py-4 text-white shadow-none">
            <Avatar name={displayName} tone="indigo" size={52} />
            <div>
              <p className="text-[1rem] font-semibold">{displayName}</p>
              <p className="text-[0.92rem] text-[#34d399]">{displayRole}</p>
            </div>
          </Card>

          <button
            type="button"
            onClick={completeInterview}
            disabled={recording || completing || interview?.status === "completed" || !questions.some((question) => question.response?.answerText)}
            className="inline-flex items-center justify-center gap-3 rounded-[28px] bg-[linear-gradient(135deg,#6366f1,#4f46e5)] px-8 py-4 text-[1.05rem] font-semibold text-white shadow-[0_18px_36px_rgba(79,70,229,0.35)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[220px]"
          >
            {completing ? "Completing..." : "Complete Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecordingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(36,40,54,0.35),_transparent_30%),linear-gradient(180deg,#121316_0%,#181b1f_100%)] px-6 py-10 text-white flex items-center justify-center">
        <div className="text-center text-white/70 font-semibold tracking-wider">LOADING INTERVIEW SESSION...</div>
      </div>
    }>
      <RecordingContent />
    </Suspense>
  );
}
