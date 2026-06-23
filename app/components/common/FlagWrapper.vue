<template>
	<section class="flags" v-if="appStore.flags?.length">
		<TransitionGroup name="flag-list">
			<div
				v-for="flag of appStore.flags"
				:key="flag.id"
				class="flag"
				:style="{
					'--flag-timeout': `${flag.timeout ?? 6000}ms`,
					'--flag-color': iconMap[flag.type ?? 'info'].color,
				}"
			>
				<div class="flag-icon">
					<BaseIcon :name="iconMap[flag.type ?? 'info'].name" :fill="iconMap[flag.type ?? 'info'].color"
						size="1.4em" />
				</div>
				<div class="flag-content">
					<h4 class="flag-title" v-if="flag.title">{{ flag.title }}</h4>
					<p class="flag-message" v-html="flag.message"></p>
				</div>
				<div class="flag-close">
					<svg v-if="flag.autoclose" class="timer" viewBox="0 0 40 40">
						<circle class="track" cx="20" cy="20" r="17" pathLength="100" />
						<circle class="progress" cx="20" cy="20" r="17" pathLength="100" />
					</svg>
					<BaseIcon @click="removeFlag(flag.id!)" name="mdi-close" size="1em" />
				</div>
			</div>
		</TransitionGroup>
	</section>
</template>

<script setup lang="ts">
import BaseIcon from './base/BaseIcon.vue';

const appStore = useAppStore();

const removeFlag = (id: string) => {
	appStore.flags = appStore.flags.filter(flag => flag.id !== id);
};

const iconMap = {
	info: { name: 'mdi-information', color: '#0452c1' },
	error: { name: 'mdi-alert-circle', color: '#ff5530' },
	warning: { name: 'mdi-alert', color: '#ffaa00' },
	success: { name: 'mdi-check-circle', color: '#46ab80' },
};
</script>

<style lang="scss">
.flags {
	position: fixed;
	right: 1em;
	top: 1em;
	display: flex;
	flex-direction: column;
	gap: .6em;
	z-index: 99999;

	.flag {
		display: flex;
		gap: 1em;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: .6em 1em;
		border-radius: 12px;
		transition: all 200ms ease-out 0s;
		max-width: 400px;

		&:hover {
			background: rgba(255, 255, 255, 1);
			transition: all 200ms ease-out 0s;
		}

		.flag-icon {
			width: 40px;
			height: 40px;
			border-radius: 4px;
		}

		.flag-content {
			flex: auto 1 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: .2em;
			color: #333;

			>.flag-title {
				margin: 0 0 .2em 0;
				font-size: 1.2rem;
				font-weight: 300;
			}

			>.flag-message {
				margin: 0;
				font-size: .84em;
				font-weight: 300;

				code {
					font-family: 'Consolas', 'Courier New', monospace;
					background-color: #f1f1f1;
					color: #c7254e;
					padding: 2px 6px;
					border-radius: 4px;
					font-size: 90%;
				}

				pre code {
					display: block;
					background-color: #f1f1f1;
					color: #c7254e;
					padding:.6rem;
					border-radius: 4px;
					border-left: 4px solid #c7254e;
					overflow-x: auto;
					white-space: pre-wrap;
					overflow-wrap: anywhere;
					// font-size: 1.2em;
					margin:.3em 0;
				}
			}
		}

		.flag-close {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 40px;
			height: 40px;
			// min-width: 40px;
			// min-height: 40px;
			// border-radius: 4px;
			// background: #ffffff;
			// backdrop-filter: blur(10px);
			// -webkit-backdrop-filter: blur(10px); /* For compatibility */
			// border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle light border */
			// box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
			cursor: pointer;

			.timer {
				position: absolute;
				aspect-ratio: 1 / 1;
				height: 80%;
				transform: rotate(-90deg);
				pointer-events: none;

				circle {
					fill: none;
					stroke-width: 2.4;
				}

				.track {
					stroke: rgba(0, 0, 0, .05);
				}

				.progress {
					stroke: color-mix(in srgb, var(--flag-color) 50%, transparent);
					stroke-linecap: round;
					stroke-dasharray: 100;
					stroke-dashoffset: 100;
					animation: flag-progress var(--flag-timeout) linear forwards;
				}
			}

			&:hover {
				background: rgba(255, 255, 255, 1);
				transition: all 200ms ease-out 0s;
			}
		}
	}

	/* АНИМАЦИИ ДЛЯ ПЛАВНОГО ДОБАВЛЕНИЯ И СДВИГА СПИСКА */
	.flag-list-enter-from {
		opacity: 0;
		transform: translateX(30px);
	}

	.flag-list-leave-to {
		opacity: 0;
		transform: translateX(30px) scale(0.9);
	}

	.flag-list-enter-active,
	.flag-list-leave-active {
		transition: all 0.3s ease;
	}

	/* Обеспечивает плавное перемещение оставшихся тостов вверх при удалении одного из них */
	.flag-list-leave-active {
		position: absolute;
		/* Необходимо для корректной работы move-эффекта */
		width: 100%;
	}

	.flag-list-move {
		transition: transform 0.3s ease;
	}
}

@keyframes flag-progress {
	from {
		stroke-dashoffset: 100;
	}

	to {
		stroke-dashoffset: 0;
	}
}
</style>
