        const showStandardTimerBtn = document.getElementById('showStandardTimer');
        const showContinuousTimerBtn = document.getElementById('showContinuousTimer');
        const standardTimerSection = document.getElementById('standardTimerSection');
        const continuousTimerSection = document.getElementById('continuousTimerSection');
        const stdHoursInput = document.getElementById('stdHours');
        const stdMinutesInput = document.getElementById('stdMinutes');
        const stdSecondsInput = document.getElementById('stdSeconds');
        const stdTimeDisplay = document.getElementById('standardTimeDisplay');
        const stdStartBtn = document.getElementById('stdStart');
        const stdPauseBtn = document.getElementById('stdPause');
        const stdResetBtn = document.getElementById('stdReset');
        const stdStatus = document.getElementById('stdStatus');

        let stdTimerInterval;
        let stdTotalSeconds = 0;
        let stdIsRunning = false;
        let stdIsPaused = false;

        function formatTime(totalSeconds) {
            if (totalSeconds < 0) totalSeconds = 0;
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }

        function updateStdDisplay() {
            stdTimeDisplay.textContent = formatTime(stdTotalSeconds);
        }

        function getStdInputTime() {
            const h = parseInt(stdHoursInput.value) || 0;
            const m = parseInt(stdMinutesInput.value) || 0;
            const s = parseInt(stdSecondsInput.value) || 0;
            return (h * 3600) + (m * 60) + s;
        }
        
        stdStartBtn.addEventListener('click', () => {
            if (stdIsRunning && !stdIsPaused) return;

            if (!stdIsPaused) { // Iniciar nauevo 
                stdTotalSeconds = getStdInputTime();
                if (stdTotalSeconds <= 0) {
                    stdStatus.textContent = "Por favor, ingresa un tiempo válido.";
                    return;
                }
            }
            
            stdIsRunning = true;
            stdIsPaused = false;
            stdStartBtn.disabled = true;
            stdPauseBtn.disabled = false;
            stdResetBtn.disabled = false;
            [stdHoursInput, stdMinutesInput, stdSecondsInput].forEach(inp => inp.disabled = true);
            stdStatus.textContent = "Temporizador en marcha...";

            clearInterval(stdTimerInterval); 
            stdTimerInterval = setInterval(() => {
                if (stdTotalSeconds > 0) {
                    stdTotalSeconds--;
                    updateStdDisplay();
                } else {
                    clearInterval(stdTimerInterval);
                    stdIsRunning = false;
                    stdStatus.textContent = "¡Tiempo finalizado!";
                    stdStartBtn.disabled = false;
                    stdPauseBtn.disabled = true;
                    [stdHoursInput, stdMinutesInput, stdSecondsInput].forEach(inp => inp.disabled = false);
                    // actualizar (sonido personalizado) v2
                    const synth = new Tone.Synth().toDestination();
                    synth.triggerAttackRelease("C4", "8n", Tone.now());
                    synth.triggerAttackRelease("G4", "8n", Tone.now() + 0.2);
                }
            }, 1000);
            updateStdDisplay(); 
        });

        stdPauseBtn.addEventListener('click', () => {
            if (!stdIsRunning || stdIsPaused) return;
            clearInterval(stdTimerInterval);
            stdIsPaused = true;
            stdStartBtn.disabled = false;
            stdStartBtn.textContent = "Reanudar";
            stdPauseBtn.disabled = true;
            stdStatus.textContent = "Temporizador pausado.";
        });

        stdResetBtn.addEventListener('click', () => {
            clearInterval(stdTimerInterval);
            stdIsRunning = false;
            stdIsPaused = false;
            stdTotalSeconds = getStdInputTime(); 
            if (stdTotalSeconds === 0 && (parseInt(stdHoursInput.value) || 0) === 0 && (parseInt(stdMinutesInput.value) || 0) === 0 && (parseInt(stdSecondsInput.value) || 0) === 0) {
                 stdTotalSeconds = (parseInt(stdHoursInput.value = 0) * 3600) + (parseInt(stdMinutesInput.value = 0) * 60) + (parseInt(stdSecondsInput.value = 10));
            }
            updateStdDisplay();
            stdStartBtn.disabled = false;
            stdStartBtn.textContent = "Iniciar";
            stdPauseBtn.disabled = true;
            [stdHoursInput, stdMinutesInput, stdSecondsInput].forEach(inp => inp.disabled = false);
            stdStatus.textContent = "Temporizador reiniciado.";
        });
    
        stdTotalSeconds = getStdInputTime();
        updateStdDisplay();

        const contHoursInput = document.getElementById('contHours');
        const contMinutesInput = document.getElementById('contMinutes');
        const contSecondsInput = document.getElementById('contSeconds');
        const pauseKeyInput = document.getElementById('pauseKey');
        const continuousTimeDisplay = document.getElementById('continuousTimeDisplay');
        const contStartBtn = document.getElementById('contStart');
        const contPauseBtn = document.getElementById('contPause');
        const contResetBtn = document.getElementById('contReset');
        const contStatus = document.getElementById('contStatus');

        let contTimerIntervalId;
        let contIntervalSeconds = 0; 
        let contTimeElapsedInInterval = 0; 
        let contTotalTimeElapsed = 0; 
        let contIsRunning = false;
        let contIsPaused = false;
        let configuredPauseKey = 'p';

        const synth = new Tone.Synth().toDestination(); 

        function playSound() {
            Tone.start(); 
            synth.triggerAttackRelease("C5", "8n", Tone.now());
            console.log("Sound played at " + new Date().toLocaleTimeString());
        }

        function updateContDisplay() {
            continuousTimeDisplay.textContent = formatTime(contTotalTimeElapsed);
        }
        
        function getContInputInterval() {
            const h = parseInt(contHoursInput.value) || 0;
            const m = parseInt(contMinutesInput.value) || 0;
            const s = parseInt(contSecondsInput.value) || 0;
            return (h * 3600) + (m * 60) + s;
        }

        contStartBtn.addEventListener('click', () => {
            if (contIsRunning && !contIsPaused) return;

            if (!contIsPaused) { 
                contIntervalSeconds = getContInputInterval();
                if (contIntervalSeconds <= 0) {
                    contStatus.textContent = "Por favor, ingresa un intervalo válido.";
                    return;
                }
                contTotalTimeElapsed = 0;
                contTimeElapsedInInterval = 0;
            }
            
            contIsRunning = true;
            contIsPaused = false;
            contStartBtn.disabled = true;
            contPauseBtn.disabled = false;
            contResetBtn.disabled = false;
            [contHoursInput, contMinutesInput, contSecondsInput, pauseKeyInput].forEach(inp => inp.disabled = true);
            contStatus.textContent = "Temporizador continuo en marcha...";

            clearInterval(contTimerIntervalId);
            contTimerIntervalId = setInterval(() => {
                contTotalTimeElapsed++;
                contTimeElapsedInInterval++;
                updateContDisplay();

                if (contTimeElapsedInInterval >= contIntervalSeconds) {
                    playSound();
                    contTimeElapsedInInterval = 0; 
                }
            }, 1000);
            updateContDisplay();
        });

        contPauseBtn.addEventListener('click', () => {
            if (!contIsRunning || contIsPaused) return;
            clearInterval(contTimerIntervalId);
            contIsPaused = true;
            contStartBtn.disabled = false;
            contStartBtn.textContent = "Reanudar";
            contPauseBtn.disabled = true;
            contStatus.textContent = "Temporizador continuo pausado.";
        });

        function toggleContinuousPauseResume() {
            if (!contIsRunning) return; 

            if (contIsPaused) { 
                contStartBtn.click(); 
            } else { 
                contPauseBtn.click();
            }
        }
        
        contResetBtn.addEventListener('click', () => {
            clearInterval(contTimerIntervalId);
            contIsRunning = false;
            contIsPaused = false;
            contTotalTimeElapsed = 0;
            contTimeElapsedInInterval = 0;
            contIntervalSeconds = getContInputInterval(); 
             if (contIntervalSeconds === 0 && (parseInt(contHoursInput.value) || 0) === 0 && (parseInt(contMinutesInput.value) || 0) === 0 && (parseInt(contSecondsInput.value) || 0) === 0) {
                 contIntervalSeconds = (parseInt(contHoursInput.value = 0) * 3600) + (parseInt(contMinutesInput.value = 0) * 60) + (parseInt(contSecondsInput.value = 5)); // Default
            }
            updateContDisplay();
            contStartBtn.disabled = false;
            contStartBtn.textContent = "Iniciar";
            contPauseBtn.disabled = true;
            [contHoursInput, contMinutesInput, contSecondsInput, pauseKeyInput].forEach(inp => inp.disabled = false);
            contStatus.textContent = "Temporizador continuo reiniciado.";
        });

        pauseKeyInput.addEventListener('keyup', (event) => {
            if (document.activeElement === pauseKeyInput) {
                 configuredPauseKey = event.key;
                 pauseKeyInput.value = configuredPauseKey; 
                 contStatus.textContent = `Tecla de pausa configurada a: '${configuredPauseKey}'`;
            }
        });
        pauseKeyInput.addEventListener('focus', () => {
            if (!pauseKeyInput.value) {
                pauseKeyInput.placeholder = "Presiona una tecla y suéltala";
            }
        });
        pauseKeyInput.addEventListener('blur', () => { 
            if (!pauseKeyInput.value && configuredPauseKey) {
                 pauseKeyInput.value = configuredPauseKey;
            } else if (!pauseKeyInput.value && !configuredPauseKey) {
                pauseKeyInput.placeholder = "Presiona una tecla y suéltala";
            }
        });


        document.addEventListener('keydown', (event) => {
            if (document.activeElement === pauseKeyInput) {
                return;
            }
            if (event.key.toLowerCase() === configuredPauseKey.toLowerCase() && continuousTimerSection.style.display !== 'none') {
                event.preventDefault(); 
                toggleContinuousPauseResume();
            }
        });
        
        contIntervalSeconds = getContInputInterval();
        updateContDisplay();


        showStandardTimerBtn.addEventListener('click', () => {
            standardTimerSection.style.display = 'block';
            continuousTimerSection.style.display = 'none';
            showStandardTimerBtn.classList.add('active');
            showContinuousTimerBtn.classList.remove('active');
        });

        showContinuousTimerBtn.addEventListener('click', () => {
            standardTimerSection.style.display = 'none';
            continuousTimerSection.style.display = 'block';
            showContinuousTimerBtn.classList.add('active');
            showStandardTimerBtn.classList.remove('active');
        });

        standardTimerSection.style.display = 'block';
        continuousTimerSection.style.display = 'none';
        configuredPauseKey = pauseKeyInput.value || 'p'; 