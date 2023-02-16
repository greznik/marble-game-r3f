import { Physics, Debug } from '@react-three/rapier'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import Effects from './Effects.jsx'
import useGame from './stores/useGame.js'
import { Stars, Sky } from '@react-three/drei'

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount)
  const blocksSeed = useGame((state) => state.blocksSeed)

  return (
    <>
      {/* <color args={['./background.jpg']} attach="background" /> */}
      <Physics>
        <Lights />
        <Sky
          distance={1000}
          turbidity={20}
          rayleigh={1.68}
          mieCoefficient={0.016}
          mieDirectionalG={0.97}
          inclination={0}
          azimuth={0.7}
          exposure={0.6}
        />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
      <Effects />
    </>
  )
}
