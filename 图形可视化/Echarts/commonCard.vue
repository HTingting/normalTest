<template>
    <div class="common-card">
        <div class="title"></div>
        <div class="value"></div>
        <div class="chart">
            <slot></slot>
        </div>
        <div class="line"></div>
        <div class="total">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props:{
            title:String,
            value: String
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped lang="">

</style>

