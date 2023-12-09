import React, { useEffect, useRef } from "react";
import SimplePeer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

const VideoChatComponent = () => {
  const videoRef = useRef();
  const peer = useRef();

  useEffect(() => {
    peer.current = new SimplePeer({ initiator: true });

    const callId = uuidv4();

    peer.current.on("signal", (data) => {
      const signalData = encodeURIComponent(JSON.stringify(data));
      const callLink = `${window.location.origin}/call/${callId}?signal=${signalData}`;
      console.log("Link para a chamada:", callLink);
      // Disponibilize o link para a outra pessoa usar
    });

    peer.current.on("stream", (remoteStream) => {
      console.log("Stream recebido:", remoteStream);
      videoRef.current.srcObject = remoteStream;
    });

    // Inicia automaticamente a chamada ao criar o link
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        peer.current.signal("sinal recebido"); // Inicia a sinalização automaticamente
      })
      .catch((error) => {
        console.error("Erro ao obter acesso à câmera/microfone:", error);
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline></video>
    </div>
  );
};

export default VideoChatComponent;
