<template>
  <svg
    class="ginkgo-drawing"
    viewBox="0 0 260 190"
    fill="none"
    aria-hidden="true"
  >
    <g ref="largeLeaf" class="ginkgo-leaf leaf-large">
      <path class="leaf-stem" d="M181 119C179 138 184 160 177 181" />
      <path
        class="leaf-shape"
        d="M181 120C168 109 145 99 125 78C117 70 113 61 116 57C118 54 121 54 123 51C126 47 129 43 133 42C137 41 139 37 143 36C147 35 150 32 154 32C158 32 160 29 164 30C169 31 174 33 179 39C181 42 183 44 185 41C188 36 191 30 197 28C201 27 204 29 208 29C212 29 214 33 218 34C223 35 225 39 228 41C232 44 234 47 236 51C238 54 241 56 243 60C246 65 241 72 235 78C220 94 195 108 181 120Z"
      />
      <g class="leaf-veins">
        <path d="M181 119C159 95 136 78 116 59M181 119C162 91 145 67 132 44M181 119C170 93 157 62 153 33M181 119C178 93 177 63 166 31M181 119C184 88 187 65 197 29M181 119C197 91 207 62 209 30M181 119C206 96 222 73 229 43M181 119C211 99 232 79 243 62" />
        <path d="M151 89C136 78 125 69 121 53M143 63C138 56 133 52 127 49M164 78C158 62 149 50 143 37M159 61C160 48 160 38 162 31M176 78C174 59 179 47 179 39M187 72C190 53 187 46 185 42M202 77C204 53 201 39 199 28M208 59C214 48 217 42 218 34M219 76C226 69 234 61 237 54M229 84C232 77 234 67 234 49" />
      </g>
    </g>

    <g ref="smallLeaf" class="ginkgo-leaf leaf-small">
      <path class="leaf-stem" d="M92 138C98 156 111 170 115 184" />
      <path
        class="leaf-shape"
        d="M92 139C80 130 57 119 40 104C32 96 25 89 27 83C28 80 31 78 33 75C36 72 39 70 41 67C44 64 48 64 51 61C54 58 59 59 63 57C67 55 71 57 75 57C80 58 85 62 88 67C90 69 91 67 93 64C97 60 101 56 106 57C110 57 114 60 118 61C122 62 125 66 128 68C132 70 133 75 136 78C139 80 141 85 139 89C135 96 124 107 116 115C106 124 99 132 92 139Z"
      />
      <g class="leaf-veins">
        <path d="M92 138C75 119 47 98 28 84M92 138C77 114 60 86 44 64M92 138C83 116 74 83 63 57M92 138C90 113 89 87 76 58M92 138C96 111 100 88 106 58M92 138C108 113 117 92 118 62M92 138C118 114 133 99 139 86" />
        <path d="M59 108C46 93 37 83 34 73M58 83C49 79 43 73 41 67M79 102C67 81 60 72 54 60M75 86C71 71 71 63 71 56M88 99C85 87 87 76 88 68M99 95C100 79 97 71 97 61M113 98C115 81 112 67 108 57M118 88C123 79 125 74 125 66M125 107C131 95 133 86 135 77" />
      </g>
    </g>
  </svg>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({ breezeTrigger: { type: Number, default: 0 } })
const smallLeaf = ref(null)
const largeLeaf = ref(null)
let motionPreference
let animations = []

function stopBreeze() {
  animations.forEach(animation => animation.cancel())
  animations = []
}

function playBreeze() {
  if (!motionPreference || motionPreference.matches) return
  const leaves = [smallLeaf.value, largeLeaf.value]
  if (leaves.some(leaf => !leaf)) return

  // Start a repeated click from the current pose instead of snapping back.
  const poses = leaves.map(leaf => getComputedStyle(leaf).transform)
  stopBreeze()
  const angles = [[-12, -1, -7.5, -6], [-4, 5, 1, 2]]
  const offsets = [0, .26, .56, .8, 1]
  animations = leaves.map((leaf, index) => leaf.animate(
    [poses[index], ...angles[index].map(angle => `rotate(${angle}deg)`)]
      .map((transform, frame) => ({ transform, offset: offsets[frame], easing: 'ease-in-out' })),
    { duration: index === 0 ? 1100 : 1250 },
  ))
}

function syncMotionPreference() {
  if (motionPreference.matches) stopBreeze()
}

watch(() => props.breezeTrigger, playBreeze, { flush: 'post' })
onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionPreference.addEventListener('change', syncMotionPreference)
})
onUnmounted(() => {
  stopBreeze()
  motionPreference?.removeEventListener('change', syncMotionPreference)
})
</script>

<style scoped>
.ginkgo-drawing {
  overflow: visible;
  pointer-events: none;
}
.ginkgo-leaf {
  --leaf-fill: #d6b55b;
  --leaf-opacity: .3;
  --leaf-outline: #ad985c;
  --leaf-vein: #ad985c;
  transform-box: view-box;
}
.leaf-small {
  transform-origin: 115px 184px;
  transform: rotate(-6deg);
}
.leaf-large {
  transform-origin: 177px 181px;
  transform: rotate(2deg);
}
.leaf-shape {
  fill: var(--leaf-fill, #d2bc79);
  fill-opacity: var(--leaf-opacity, .24);
  stroke: var(--leaf-outline, #ad985c);
  stroke-width: .9;
  stroke-linejoin: round;
}
.leaf-veins {
  stroke: var(--leaf-vein, #ad985c);
  stroke-width: .65;
  stroke-opacity: .68;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.leaf-stem {
  stroke: var(--leaf-outline, #ad985c);
  stroke-width: 1.25;
  stroke-linecap: round;
}
</style>
