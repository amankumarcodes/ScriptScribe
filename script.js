// Wait for the DOM to be fully loaded before running the script
    document.addEventListener('DOMContentLoaded', function() {
        // DOM Elements
        const inputText = document.getElementById('input-text');
        const preview = document.getElementById('preview');
        const fontButtons = document.querySelectorAll('.font-button');
        const fontUpload = document.getElementById('font-upload');
        const textColor = document.getElementById('text-color');
        const fontSize = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        const lineSpacing = document.getElementById('line-spacing');
        const lineSpacingValue = document.getElementById('line-spacing-value');
        const wordSpacing = document.getElementById('word-spacing');
        const wordSpacingValue = document.getElementById('word-spacing-value');
        const backgroundOptions = document.querySelectorAll('.background-option');
        const backgroundColorPicker = document.getElementById('background-color-picker');
        const templateSelector = document.getElementById('template-selector');
        const formatButtons = document.querySelectorAll('.format-button');
        const downloadPdfButton = document.getElementById('download-pdf');
        const downloadImageButton = document.getElementById('download-image');

        // Templates
        const templates = {
            thankYouNote: "Dear [Name],\n\nThank you so much for your [gift/support/help]. I really appreciate your thoughtfulness and generosity.\n\nSincerely,\n[Your Name]",
            businessLetter: "Dear [Recipient],\n\nI am writing to [purpose of letter]. I would appreciate your [request/consideration/feedback].\n\nThank you for your time and attention to this matter.\n\nSincerely,\n[Your Name]\n[Your Title]\n[Your Contact Information]",
            invitation: "Dear [Name],\n\nYou are cordially invited to [event] on [date] at [time] at [location].\n\nPlease RSVP by [date].\n\nWe look forward to seeing you!\n\nBest regards,\n[Your Name]"
        };

        // Initialize
        function init() {
            // Set default font
            preview.style.fontFamily = "'Caveat', cursive";
            
            // Update preview when input changes
            inputText.addEventListener('input', updatePreview);
            
            // Apply font selection
            fontButtons.forEach(button => {
                button.addEventListener('click', function() {
                    fontButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    preview.style.fontFamily = this.dataset.font;
                });
            });
            
            // Apply text color
            textColor.addEventListener('input', function() {
                preview.style.color = this.value;
            });
            
            // Apply font size
            fontSize.addEventListener('input', function() {
                preview.style.fontSize = this.value + 'px';
                fontSizeValue.textContent = this.value + 'px';
            });
            
            // Apply line spacing
            lineSpacing.addEventListener('input', function() {
                preview.style.lineHeight = this.value;
                lineSpacingValue.textContent = this.value;
            });
            
            // Apply word spacing
            wordSpacing.addEventListener('input', function() {
                preview.style.wordSpacing = this.value + 'px';
                wordSpacingValue.textContent = this.value + 'px';
            });
            
            // Apply background options
            backgroundOptions.forEach(option => {
                option.addEventListener('click', function() {
                    backgroundOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    const bg = this.dataset.background;
                    if (bg === 'white') {
                        preview.style.backgroundColor = '#ffffff';
                        preview.style.backgroundImage = 'none';
                    } else if (bg === 'lined') {
                        preview.style.backgroundImage = "url('assets/lined.png')";
                    } else if (bg === 'grid') {
                        preview.style.backgroundImage = "url('assets/grid.png')";
                    }
                });
            });
            
            // Apply custom background color
            backgroundColorPicker.addEventListener('input', function() {
                backgroundOptions.forEach(opt => opt.classList.remove('active'));
                preview.style.backgroundColor = this.value;
                preview.style.backgroundImage = 'none';
            });
            
            // Apply templates
            templateSelector.addEventListener('change', function() {
                const template = this.value;
                if (templates[template]) {
                    inputText.value = templates[template];
                    updatePreview();
                }
            });
            
            // Custom font upload
            fontUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const fontName = 'customFont' + Date.now();
                        const fontFace = new FontFace(fontName, e.target.result);
                        fontFace.load().then(function(loadedFace) {
                            document.fonts.add(loadedFace);
                            preview.style.fontFamily = fontName;
                            // Remove active class from all font buttons
                            fontButtons.forEach(btn => btn.classList.remove('active'));
                        });
                    };
                    reader.readAsArrayBuffer(file);
                }
            });
            
            // Format buttons
            formatButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const command = this.dataset.command;
                    const value = this.dataset.value || '';
                    document.execCommand(command, false, value);
                    preview.focus();
                });
            });
            
            // Download as PDF
            downloadPdfButton.addEventListener('click', function() {
                // Initialize jsPDF
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Use html2canvas to capture the preview
                html2canvas(preview).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 297; // A4 height in mm
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;
                    
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        doc.addPage();
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                    
                    doc.save('ScriptScribe-converter.pdf');
                });
            });
            
            // Download as Image
            downloadImageButton.addEventListener('click', function() {
                html2canvas(preview).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'handwritten-text.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            });
        }

        // Update preview with input text
        function updatePreview() {
            if (inputText.value.trim() === '') {
                preview.textContent = 'Your handwritten text will appear here';
            } else {
                preview.textContent = inputText.value;
            }
        }

        // Initialize the application
        init();
    });