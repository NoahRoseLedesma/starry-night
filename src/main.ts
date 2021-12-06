import * as THREE from 'three'

function getRandomArbitrary(min: number, max: number) {
    // Pick random numbers in [min, max] excluding values between [-4, 4]
    let random: number = 0
    do {
        random = Math.random() * (max - min) + min;
    } while(random >= -4 && random <= 4)
    return random;
}

function main() {
    // Set up the scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    const ambient = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambient)


    // Add our stars
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshLambertMaterial({color: 0xffffff})
    const stars: THREE.Mesh[] = []
    for(let i = 0; i < 5000; i++) {
        const cube = new THREE.Mesh(geometry, material)
        const pos = new THREE.Vector3(getRandomArbitrary(-1000, 1000), getRandomArbitrary(-1000, 1000), getRandomArbitrary(5, -1000))
        cube.scale.multiplyScalar(0.5)
        cube.position.set(pos.x, pos.y, pos.z)
        stars.push(cube)
        scene.add(cube)
    }

    // Render loop
    let animation_handle: number = 0
    function animate() {
        animation_handle = requestAnimationFrame(animate)
        renderer.render(scene, camera)

        camera.updateMatrix();
        const frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(camera.projectionMatrix)

        stars.forEach(star => {
            const throttle = Number((document.getElementById('throttle') as HTMLInputElement).value)
            const dir = (new THREE.Vector3(0, 0, 1000)).sub(star.position).normalize().multiplyScalar(throttle)
            star.position.add(dir)
            // If the star is out of view, "respawn" it.
            if(!frustum.intersectsObject(star)) {
                star.position.setX(getRandomArbitrary(-1000, 1000))
                star.position.setY(getRandomArbitrary(-1000, 1000))
                star.position.setZ(-1000)
            }
        })
    }
    animate()

    window.onresize = () => {
        document.body.removeChild(renderer.domElement);
        cancelAnimationFrame(animation_handle)
        main()
    }
}

main()