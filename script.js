import * as THREE from 'three';

class WiFiWaveSimulator {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth * 0.7, 500);
        document.getElementById('visualizer').appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
        this.setupControls();
        this.setupEventListeners();
    }

    setupControls() {
        this.frequencySlider = document.getElementById('frequencySlider');
        this.strengthSlider = document.getElementById('strengthSlider');
        this.waveTypeSelect = document.getElementById('waveTypeSelect');
        this.simulateBtn = document.getElementById('simulateBtn');

        this.frequencySlider.addEventListener('input', () => {
            document.getElementById('frequencyValue').textContent = 
                `${this.frequencySlider.value} GHz`;
        });

        this.strengthSlider.addEventListener('input', () => {
            document.getElementById('strengthValue').textContent = 
                `${this.strengthSlider.value}%`;
        });
    }

    setupEventListeners() {
        this.simulateBtn.addEventListener('click', () => this.generateWave());
        window.addEventListener('resize', () => this.onWindowResize());
    }

    generateWave() {
        // Clear previous wave
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }

        const frequency = parseFloat(this.frequencySlider.value);
        const strength = parseFloat(this.strengthSlider.value);
        const waveType = this.waveTypeSelect.value;

        const geometry = new THREE.BufferGeometry();
        const points = [];

        for (let x = -5; x <= 5; x += 0.1) {
            let y;
            switch(waveType) {
                case 'sine':
                    y = Math.sin(x * frequency) * (strength / 100);
                    break;
                case 'square':
                    y = Math.sign(Math.sin(x * frequency)) * (strength / 100);
                    break;
                case 'triangle':
                    y = 2 * Math.abs((x * frequency) % 2 - 1) * (strength / 100) - 1;
                    break;
            }
            points.push(new THREE.Vector3(x, y, 0));
        }

        geometry.setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ 
            color: 0x3498db, 
            linewidth: 3 
        });

        const line = new THREE.Line(geometry, material);
        this.scene.add(line);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const container = document.getElementById('visualizer');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Initialize the simulator when the page loads
window.addEventListener('load', () => {
    new WiFiWaveSimulator();
});

