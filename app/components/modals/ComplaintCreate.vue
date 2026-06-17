<template>
	<div class="complaint-modal">
		<main class="content">
			<section class="grid">
				<section class="left">
					<div class="field">
						<label>Абонент<BaseIcon name="mdi-account-check"/></label>
						<div class="search">
							<BaseTextBox v-model="form.account" placeholder="Поиск по ФИО или лицевому счёту..."/>
							<BaseButton variant="outlined" prependIcon="mdi-magnify"/>
						</div>
					</div>

					<div class="subscriber">
						<strong>Маратов Ержан Кайратович</strong>
						<span>ЛС: 10 000 26 57</span>
						<span>Чуйская область, Ысык-Атинский район, ул. Абая 45, кв. 12</span>
					</div>

					<div class="field">
						<label>Клиент</label>
						<BaseTextBox v-model="form.client" placeholder="Введите ФИО"/>
					</div>

					<div class="field">
						<label>Телефон</label>
						<BaseTextBox v-model="form.phone" placeholder="+996..."/>
					</div>
				</section>

				<section class="right">
					<div class="field">
						<label>Тема обращения<span>*</span></label>
						<select v-model="form.subject">
							<option value="">Выберите тему</option>
							<option v-for="subject of subjects" :key="subject" :value="subject">{{ subject }}</option>
						</select>
					</div>

					<div class="field">
						<label>Уровень срочности</label>
						<select v-model="form.urgency">
							<option v-for="urgency of urgencies" :key="urgency" :value="urgency">{{ urgency }}</option>
						</select>
					</div>

					<div class="field">
						<label>Подтверждающие материалы</label>
						<BaseFileMultiPicker v-model="files"/>
					</div>
				</section>

				<section class="description">
					<div class="field">
						<label>Описание ситуации</label>
						<BaseMemo v-model="form.description" height="110px" resize="vertical" placeholder="Подробное описание проблемы абонента..."/>
					</div>
				</section>

				<section class="template">
					<div class="title">
						<BaseIcon name="mdi-file-document-outline"/>
						<strong>Шаблон ответа абоненту</strong>
					</div>
					<div class="text">
						Уважаемый(ая) {{ form.client || 'абонент' }}! Ваше обращение будет принято в работу.
						По результатам проверки Вам будет направлено уведомление. Благодарим за обращение.
					</div>
				</section>

				<InfoBox v-if="message.type" :type="message.type" :title="message.title" :message="message.text"/>
			</section>
		</main>

		<footer class="footer">
			<div class="buttons">
				<BaseButton prependIcon="mdi-check" :disabled="loading" @click="submit">
					{{ loading ? 'Регистрация...' : 'Зарегистрировать жалобу' }}
				</BaseButton>
				<BaseButton prependIcon="mdi-close" :disabled="loading" variant="secondary" @click="close(false)">
					Отмена
				</BaseButton>
			</div>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, h, type PropType } from 'vue';
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import BaseMemo from '../common/base/BaseMemo.vue';
import BaseTextBox from '../common/base/BaseTextBox.vue';
import InfoBox from '../common/InfoBox.vue';

type MessageType = '' | 'info' | 'error' | 'warning' | 'protect' | 'success';

const BaseFileMultiPicker = defineComponent({
	name: 'BaseFileMultiPickerStub',
	props: {
		modelValue: { type: Array as PropType<File[]>, default: () => [] },
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		function onChange(event: Event) {
			const input = event.target as HTMLInputElement;
			emit('update:modelValue', Array.from(input.files || []));
		}

		return () => h('label', { class: 'file-stub' }, [
			h(BaseIcon, { name: 'mdi-cloud-upload', size: '24' }),
			h('span', 'Перетащите файлы или выберите вручную'),
			h('small', props.modelValue.length ? `Выбрано файлов: ${props.modelValue.length}` : 'Макс. 10 МБ'),
			h('input', { type: 'file', multiple: true, onChange }),
		]);
	}
});

const { $fetchCallGas, $flags } = useNuxtApp();

const subjects = ['Некорректные начисления', 'Нет газа', 'Проблема со счётчиком', 'Консультация'];
const urgencies = ['Обычная', 'Высокая', 'Критическая'];
const files = ref<File[]>([]);
const loading = ref(false);
const message = reactive({
	type: '' as MessageType,
	title: '',
	text: '',
});
const form = reactive({
	account: '',
	client: '',
	phone: '',
	subject: subjects[0],
	urgency: urgencies[0],
	description: '',
});

async function submit() {
	if (loading.value) return;
	message.type = '';

	if (!validate()) return;

	loading.value = true;

	try {
		await $fetchCallGas('/complaints', {
			method: 'POST',
			body: {
				account: form.account,
				client: form.client,
				phone: form.phone,
				subject: form.subject,
				urgencyLevel: form.urgency,
				description: form.description,
				files: files.value.map(file => ({ name: file.name, size: file.size, type: file.type })),
			}
		});

		$flags.success('Жалоба зарегистрирована');
		close(true);
	}
	catch (error: any) {
		const data = error?.data || error?.response?._data;
		const text = data?.message || data?.error || data?.detail || error?.statusMessage || error?.message;

		message.type = 'error';
		message.title = 'Не удалось зарегистрировать жалобу';
		message.text = Array.isArray(text) ? text.join('\n') : (text || 'Проверьте данные и попробуйте ещё раз.');
	}
	finally {
		loading.value = false;
	}
}

function validate() {
	if (!form.subject) {
		message.type = 'warning';
		message.title = 'Выберите тему обращения';
		message.text = 'Тема нужна для маршрутизации жалобы.';
		return false;
	}

	if (!form.description.trim()) {
		message.type = 'warning';
		message.title = 'Заполните описание';
		message.text = 'Опишите ситуацию абонента перед регистрацией жалобы.';
		return false;
	}

	return true;
}

function close(result: boolean) {
	const appStore = useAppStore();
	const modal = appStore?.modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.complaint-modal {
	width: min(760px, 82vw);

	.content {
		padding-bottom: 1.4em;

		.grid {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(320px, .85fr);
			gap: 1.2em 2em;

			.left,
			.right {
				display: grid;
				align-content: start;
				gap: .8em;
			}

			.field {
				display: grid;
				gap: .4em;

				label {
					display: flex;
					align-items: center;
					gap: .35em;
					color: #333;
					font-size: .82rem;
					font-weight: 700;

					span,
					.base-icon {
						color: #2563eb;
					}
				}

				select {
					width: 100%;
					padding: .72em .8em;
					border: 1px solid #d4d4d4;
					border-radius: 7px;
					background: #fff;
					color: #171717;
					font: inherit;
				}
			}

			.search {
				display: grid;
				grid-template-columns: minmax(0, 1fr) auto;
				gap: .5em;
			}

			.subscriber {
				display: flex;
				align-items: center;
				gap: .6em;
				min-height: 42px;
				padding: 0 .8em;
				border-radius: 8px;
				background: #eaf1ff;
				color: #4b5563;
				font-size: .76rem;

				strong {
					color: #174ea6;
					font-size: .82rem;
					white-space: nowrap;
				}

				span {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.file-stub {
				display: grid;
				grid-template-columns: auto 1fr auto;
				align-items: center;
				gap: .7em;
				min-height: 58px;
				padding: .75em .9em;
				border: 2px dashed #d1d5db;
				border-radius: 8px;
				background: #fafafa;
				color: #6b7280;
				font-size: .8rem;
				cursor: pointer;

				.base-icon {
					color: #9ca3af;
				}

				small {
					color: #9ca3af;
					font-size: .72rem;
				}

				input {
					display: none;
				}
			}

			.description,
			.template,
			.info-box {
				grid-column: 1 / -1;
			}

			.template {
				padding: .9em 1em;
				border: 1px solid #dbe5f7;
				border-radius: 8px;
				background: #f8fafc;

				.title {
					display: flex;
					align-items: center;
					gap: .45em;
					color: #174ea6;
				}

				.text {
					margin-top: .5em;
					color: #4b5563;
					font-size: .86rem;
					line-height: 1.45;
					white-space: pre-wrap;
				}
			}
		}
	}

	.footer {
		.buttons {
			display: flex;
			justify-content: flex-end;
			gap: .5em;
		}
	}

	@media (max-width: 760px) {
		width: 100%;

		.content {
			.grid {
				grid-template-columns: 1fr;

				.subscriber {
					display: grid;
					align-items: start;
					padding: .8em;

					strong,
					span {
						white-space: normal;
					}
				}

				.file-stub {
					grid-template-columns: auto 1fr;

					small {
						grid-column: 2;
					}
				}
			}
		}

		.footer {
			.buttons {
				display: grid;
			}
		}
	}
}
</style>
