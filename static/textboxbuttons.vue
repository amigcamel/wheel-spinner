<!--
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<template>
  <span>
    <div class="field">
      <b-checkbox
        v-model="registrable"
        :value="true">
        Registrable
        (people: {{this.$store.state.wheelConfig.sids.length}})
      </b-checkbox>
    </div>
    <b-button size="is-small" type="is-light" :disabled="buttonsDisabled" @click="shuffle">
      <i class="fas fa-random"></i>&nbsp;{{ $t('textboxbuttons.Shuffle') }}
    </b-button>
    <b-button size="is-small" type="is-light" :disabled="buttonsDisabled" @click="sort">
      <i class="fas fa-sort-alpha-up"></i>&nbsp;{{ $t('textboxbuttons.Sort') }}
    </b-button>
    <b-upload accept="image/*" multiple v-model="uploadedImage" :disabled="buttonsDisabled">
      <a class="button is-small is-light" :disabled="buttonsDisabled">
        <i class="far fa-image"></i>&nbsp;{{ $t('textboxbuttons.Add image') }}
      </a>
    </b-upload>
  </span>
</template>

<script>
  import * as Util from './Util.js';
  import * as ImageUtil from './ImageUtil.js';
  import HSDIC from './data.js';

  async function registerSids() {
    const url = '/api/targetsids';
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
    });
    return await response.json();
  };

  function genSidInfo(sid) {
    return `<img src="https://lh3.googleusercontent.com/a-/${HSDIC[sid].uri}" style="font-size: 1rem; font-style: inherit; height: 25px"> ${sid.slice(1,4)} ${HSDIC[sid].name.split(' ')[0]}`;
  }

  export default {
    mounted: function() {
      this.collectSids();
    }, 
    data() {
      return {
        uploadedImage: [],
        registrable: true,
      }
    },
    watch: {
      uploadedImage: function(files) {
        if (files.length == 0) return;
        for (const file of files) {
          const reader = new FileReader();
          const self = this;
          reader.onload = async function(e) {
            const dataUri = await ImageUtil.optimizeSliceImage(e.target.result);
            const imageTag = `<img src="${dataUri}" style="height:25px" style="font-size: 1rem;">`;
            self.$store.commit('appendNames', [imageTag]);
          }
          reader.readAsDataURL(file);
        }
        this.uploadedImage = [];
      },
      registrable: function(val) {
        if (val) {
          this.collectSids();
        }
      }
    },
    computed: {
      buttonsDisabled() {
        const appStatus = this.$store.state.appStatus;
        return appStatus.sheetLinked || appStatus.wheelSpinning;
      }
    },
    methods: {
      shuffle() {
        this.$store.commit('shuffleNames');
      },
      sort() {
        this.$store.commit('sortNames');
      },
      collectSids() {
        const intv = setInterval(() => {
          if (!this.registrable) {
            clearInterval(intv);
            return;
          }
          const resp = registerSids();
          resp
            .then((resp) => {
              const sids = resp.targetSids;
              for (const sid of sids) {
                if (this.$store.state.wheelConfig.sids.indexOf(sid) === -1) {
                  this.$store.state.wheelConfig.sids.push(sid);
                  this.$store.state.wheelConfig.names.push(genSidInfo(sid));
                }
              }
            });
        }, 1000);
      }
    }
  }
</script>
