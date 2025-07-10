<template>
    <q-card flat :class="['rounded-lg q-mb-lg', { 'bg-blue-grey-1': !$q.dark.isActive }]">
        <q-form @submit.prevent="fire" @reset="clear">
            <q-card-section>
                <div class="text-uppercase text-weight-bold q-mb-md">Search</div>
                <div class="row items-center justify-between">
                    <div
                        :class="[
                            'col row items-center ',
                            { 'q-col-gutter-sm': $q.screen.lt.sm },
                            { 'q-col-gutter-sm': !$q.screen.lt.sm },
                        ]"
                    >
                        <div
                            v-for="(item, i) in form"
                            :key="i"
                            :class="[
                                { 'col-6 col-md-3': ['text', 'date', 'select'].includes(item.type) },
                                { 'col-12 col-md-6': ['daterange'].includes(item.type) },
                            ]"
                        >
                            <q-input
                                v-if="item.type === 'text'"
                                v-model="item.value"
                                outlined
                                dense
                                type="text"
                                :label="item.label"
                                :placeholder="item.placeholder"
                                :class="[
                                    ' rounded-md',
                                    { 'bg-white': !$q.dark.isActive },
                                    { 'bg-dark-page': $q.dark.isActive },
                                ]"
                            />

                            <q-select
                                v-if="item.type === 'select'"
                                v-model="item.value"
                                :options="item.options"
                                dense
                                :emit-value="item.emitValue"
                                :map-options="item.mapOptions"
                                :multiple="item.multiple"
                                :use-chips="item.useChips"
                                :label="item.label"
                                :option-value="item.optionValue"
                                :option-label="item.optionLabel"
                                outlined
                                :class="[
                                    ' rounded-md',
                                    { 'bg-white': !$q.dark.isActive },
                                    { 'bg-dark-page': $q.dark.isActive },
                                ]"
                            >
                                <template v-if="$q.dark.isActive && item.useChips" v-slot:selected-item="scope">
                                    <q-chip
                                        removable
                                        dense
                                        @remove="scope.removeAtIndex(scope.index)"
                                        :tabindex="scope.tabindex"
                                        color="primary"
                                        text-color="white"
                                    >
                                        {{ scope.opt[item.optionLabel] || scope.opt.label }}
                                    </q-chip>
                                </template>
                            </q-select>

                            <q-select
                                v-if="item.type === 'select-autocomplete'"
                                v-model="item.value"
                                :options="item.options"
                                dense
                                :emit-value="item.emitValue"
                                :map-options="item.mapOptions"
                                :multiple="item.multiple"
                                :use-chips="item.useChips"
                                :label="item.label"
                                :option-value="item.optionValue"
                                :option-label="item.optionLabel"
                                :use-input="item.useInput"
                                :fill-input="item.useInput"
                                :hide-selected="item.hideSelected"
                                input-debounce="0"
                                outlined
                                :class="[
                                    ' rounded-md',
                                    { 'bg-white': !$q.dark.isActive },
                                    { 'bg-dark-page': $q.dark.isActive },
                                ]"
                                @filter="
                                    (val, update, abort) => {
                                        filterSelect(val, update, abort, item);
                                    }
                                "
                            >
                                <template v-if="$q.dark.isActive && item.useChips" v-slot:selected-item="scope">
                                    <q-chip
                                        removable
                                        dense
                                        @remove="scope.removeAtIndex(scope.index)"
                                        :tabindex="scope.tabindex"
                                        color="primary"
                                        text-color="white"
                                    >
                                        {{ scope.opt[item.optionLabel] || scope.opt.label }}
                                    </q-chip>
                                </template>
                            </q-select>

                            <q-toggle
                                v-if="item.type === 'checkbox'"
                                dense
                                v-model="item.value"
                                :label="item.label"
                                color="green"
                                :true-value="item.trueValue || true"
                                :false-value="item.falseValue || false"
                            />

                            <div v-if="item.type === 'daterange'" class="row items-center q-gutter-sm">
                                <div class="col">
                                    <q-input
                                        v-model="item.valueFrom"
                                        dense
                                        outlined
                                        type="text"
                                        :label="`${item.label} From Date`"
                                        :class="[
                                            ' rounded-md',
                                            { 'bg-white': !$q.dark.isActive },
                                            { 'bg-dark-page': $q.dark.isActive },
                                        ]"
                                    >
                                        <template v-slot:append>
                                            <q-icon
                                                v-if="item.valueFrom"
                                                name="close"
                                                @click="item.valueFrom = ''"
                                                class="cursor-pointer"
                                            />
                                            <q-icon name="date_range" class="cursor-pointer">
                                                <q-popup-proxy
                                                    :ref="`${item.name}max`"
                                                    transition-show="scale"
                                                    transition-hide="scale"
                                                >
                                                    <q-date
                                                        v-model="item.valueFrom"
                                                        :mask="item.withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'"
                                                    >
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                                        </div>
                                                    </q-date>
                                                </q-popup-proxy>
                                            </q-icon>
                                            <q-icon v-if="item.withTime" name="schedule" class="cursor-pointer">
                                                <q-popup-proxy
                                                    transition-show="scale"
                                                    transition-hide="scale"
                                                    :ref="`${item.name}Tmin`"
                                                >
                                                    <q-time v-model="item.valueFrom" mask="YYYY-MM-DD HH:mm" format24h>
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                                        </div>
                                                    </q-time>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col">
                                    <q-input
                                        v-model="item.valueTo"
                                        dense
                                        outlined
                                        type="text"
                                        :label="`${item.label} To Date`"
                                        :class="[
                                            ' rounded-md',
                                            { 'bg-white': !$q.dark.isActive },
                                            { 'bg-dark-page': $q.dark.isActive },
                                        ]"
                                    >
                                        <template v-slot:append>
                                            <q-icon
                                                v-if="item.valueTo"
                                                name="close"
                                                @click="item.valueTo = ''"
                                                class="cursor-pointer"
                                            />
                                            <q-icon name="date_range" class="cursor-pointer">
                                                <q-popup-proxy
                                                    :ref="`${item.name}max`"
                                                    transition-show="scale"
                                                    transition-hide="scale"
                                                >
                                                    <q-date
                                                        :mask="item.withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'"
                                                        v-model="item.valueTo"
                                                        @input="() => $refs[`${item.name}max`][0].hide()"
                                                    >
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                                        </div>
                                                    </q-date>
                                                </q-popup-proxy>
                                            </q-icon>
                                            <q-icon v-if="item.withTime" name="schedule" class="cursor-pointer">
                                                <q-popup-proxy
                                                    transition-show="scale"
                                                    transition-hide="scale"
                                                    :ref="`${item.name}Tmax`"
                                                >
                                                    <q-time
                                                        v-model="item.valueTo"
                                                        mask="YYYY-MM-DD HH:mm"
                                                        @input="() => $refs[`${item.name}Tmax`][0].hide()"
                                                        format24h
                                                    >
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                                        </div>
                                                    </q-time>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="form.length === 1 || simple" class="row justify-end q-gutter-sm">
                        <q-btn outline color="primary" label="Reset" type="reset" />
                        <q-btn
                            color="primary"
                            label="Search"
                            :disabled="form.every((e) => !e.value && !e.valueFrom && !e.valueTo)"
                            type="submit"
                        />
                    </div>
                </div>
            </q-card-section>
            <q-separator inset v-if="form.length > 1 || !!simple" />
            <q-card-section v-if="form.length > 1 || !!simple">
                <div class="row justify-end q-gutter-sm">
                    <q-btn color="secondary" label="Reset" type="reset" :class="[{ col: $q.screen.lt.sm }]" />
                    <q-btn
                        color="primary"
                        label="Search"
                        :disabled="form.every((e) => !e.value && !e.valueFrom && !e.valueTo)"
                        type="submit"
                        :class="[{ col: $q.screen.lt.sm }]"
                    />
                </div>
            </q-card-section>
        </q-form>
    </q-card>
</template>

<script setup>
import { reactive, watch, onUnmounted } from 'vue';
import { date } from 'quasar';

const props = defineProps({
    fields: {
        type: Array,
        required: true,
        default() {
            return [];
        },
    },
    simple: Boolean,
    initial: {
        type: Object,
        // required: true,
        default() {
            return {};
        },
    },
});

const emit = defineEmits(['find']);

const form = reactive([...props.fields]);

watch(
    () => props.fields,
    (newValue) => {
        // this is make recursive
        // const makeOver = newValue.map((m) => {
        //     if (m.type === 'select') {
        //         m.options_original = [...m.options];
        //     }
        //     return m;
        // });

        // form.value = [...makeOver];
        form.splice(0, form.length, ...newValue.map((field) => ({ ...field }))); // Deep clone fields
    },
    { deep: true },
);

onUnmounted(() => {
    form.forEach((field) => {
        if (field.defaultValue !== undefined) {
            field.value = field.defaultValue;
        } else {
            delete field.value;
        }
    });
});

const clear = () => {
    form.forEach((field) => {
        if (field.defaultValue !== undefined) {
            field.value = field.defaultValue;
        } else {
            delete field.value;
        }
    });
    emit('find', props.initial);
};

const filterSelect = (val, update, abort, item) => {
    // console.log(item.options_original);
    // if (val === '') {
    //     update(() => {
    //         item.options = item.options_original;
    //     });
    //     return;
    // }

    update(() => {
        const needle = val.toLocaleLowerCase();
        item.options = item.options_original.filter(
            (v) => v[item.optionLabel].toLocaleLowerCase().indexOf(needle) > -1,
        );
    });
};

const fire = () => {
    const filter = form.reduce((aggr, curr) => {
        if (!curr.value && !curr.valueFrom && !curr.valueTo) return aggr;

        switch (curr.type) {
            case 'text':
                if (curr.operator === 'contains') {
                    aggr[curr.name] = { $regex: curr.value, $options: 'i' };
                } else if (curr.operator === 'or') {
                    const orConditions = curr.name
                        .split('.')
                        .map((field) => ({ [field]: { $regex: curr.value, $options: 'i' } }));
                    aggr.$or = orConditions;
                } else if (curr.operator === 'ne') {
                    aggr[curr.name] = { $ne: curr.value };
                } else {
                    aggr[curr.name] = curr.value;
                }
                break;

            case 'number':
                aggr[curr.name] = Number(curr.value);
                break;

            case 'checkbox':
                aggr[curr.name] = curr.value;
                break;

            case 'select':
                aggr[curr.name] = curr.value;
                if (curr.multiple) aggr[curr.name] = { $in: curr.value };
                if (curr.operator === 'contains') aggr[curr.name] = { $regex: curr.value, $options: 'i' };
                break;

            case 'multiselect':
                aggr[curr.name] = { $in: curr.value };
                break;

            case 'daterange':
                aggr[curr.name] = {
                    $gte: date.startOfDate(curr.valueFrom ?? new Date(), 'day'),
                    $lte: date.endOfDate(curr.valueTo ?? new Date(), 'day'),
                };
                break;

            default:
                break;
        }
        return aggr;
    }, {});

    emit('find', filter);
}
</script>
