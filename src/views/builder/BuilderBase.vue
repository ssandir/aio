<template>
    <v-container fluid fill-height class="bg-secondary full-height">
        <v-row align="center" justify="center" class="home-header">
            <v-col cols="12" class="text-center">
                <v-typography class="text-h1 text-primary">
                    My AI Online
                </v-typography>
            </v-col>
        </v-row>

        <!-- New Row for Text at the Bottom -->
        <v-row align="center" justify="center" class="home-footer">
            <v-col cols="12" class="text-center">
                <v-typography class="text-body-1 text-primary" @click.stop="homeStore.toggleBuilder()">
                    BUILD
                </v-typography>
            </v-col>
        </v-row>
    </v-container>
</template>