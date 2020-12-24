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
      </b-checkbox>
      <b-button size="is-small" @click="showMembers()">
        people: {{this.$store.state.wheelConfig.names.length}}
      </b-button>
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
  import { genSidInfo }from './sidUtils.js';

  async function registerSids() {
    const url = '/api/targetsids';
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      });
      return await response.json();
    };

  const ModalForm = {
    props: ['names'],
    template: `
    <div class="container">
      <div v-for="(c, index) in names">
        <div v-if="index == 0 || index % 8 == 0" class="columns is-gapless">
          <div v-for="k in [...Array(8).keys()]" v-if="index+k<names.length" class="column" v-html="names[index+k].replace('span', 'p').replace('25px', '100px')"></div>
        </div>
      </div>
    </div>
    `
  }


  export default {
    data() {
      return {
        uploadedImage: [],
        ws: null,
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
          this.syncTargetSids();
        } else {
          if (this.ws != null) {
            this.ws.close();
            this.ws = null;
            console.log('ws closed.')
          }
        }
      }
    },
    computed: {
      names() {
        return this.$store.state.wheelConfig.names
      },
      buttonsDisabled() {
        const appStatus = this.$store.state.appStatus;
        return appStatus.sheetLinked || appStatus.wheelSpinning;
      },
      registrable: {
        get() {
          return this.$store.state.appStatus.registrable;
        },
        set () {
          this.$store.commit('toggleRegistrable');
        },
      },
    },
    methods: {
      syncTargetSids() {
        this.ws = new WebSocket('/ws/targetsids');     
        this.ws.addEventListener('message', (event) => {
          console.log(event.data);
          const sid = JSON.parse(event.data).sid;
	  this.$buefy.snackbar.open({
	    duration: 10000,
	    message: `${genSidInfo(sid, '30px', '1.6rem')}`,
	    type: 'is-warning',
	    position: 'is-top-left',
	    queue: false,
	    actionText: 'joined',
	  });
          this.collectSids();
        });
      },
      showMembers(names) {
	this.$buefy.modal.open({
	    parent: this,
            props: {
              names: this.names,
            },
	    component: ModalForm,
	    trapFocus: true,
	})
      },
      shuffle() {
        this.$store.commit('shuffleNames');
      },
      sort() {
        this.$store.commit('sortNames');
      },
      collectSids() {
        const resp = registerSids();
        resp
          .then((resp) => {
            const sids = resp.targetSids;
            for (const sid of sids) {
              if (this.$store.state.wheelConfig.sids.indexOf(sid) === -1) {
                this.$store.state.wheelConfig.sids.unshift(sid);
                this.$store.state.wheelConfig.names.unshift(genSidInfo(sid));
              }
            }
          }
        );
      }
    }
  }
</script>
