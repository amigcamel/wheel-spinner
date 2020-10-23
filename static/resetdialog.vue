<template>
  <div>
    <b-modal :active.sync="showWarning" :width="640" scroll="keep">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <i class="fa fa-redo-alt"></i>&nbsp;Clear Local Storage?
          </p>
        </header>
        <section class="modal-card-body">
          <p>
            Your current list will be cleared and recover to the default list.
          </p>
          <p>
            Are you sure?
          </p>
        </section>
        <footer class="modal-card-foot" style="justify-content:flex-end">
          <b-button size="is-medium" @click="enter_Inactive()">
            Cancel
          </b-button>
          <b-button size="is-medium" type="is-danger" @click="enter_ClearLocalStorage()">
            Reset
          </b-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import * as ServerFunctions from './ServerFunctions.js';
  import * as Locales from './Locales.js';

  export default {
    data() {
      return {
        fsm: 'Inactive', editableWheel: false, sharableLink: ''
      }
    },
    computed: {
      showWarning() {
        return this.fsm=='ShowingWarning';
      },
      showOptions() {
        return this.fsm=='UserIsSettingOptions';
      },
      showLink() {
        return this.fsm=='ShowingLink';
      }
    },
    methods: {
      show() {
        const wheelConfig = this.$store.state.wheelConfig;
        if (wheelConfig.isTooBigForDatabase()) {
          alert(this.$t('sharedialog.Sorry, too many images'));
          return;
        }
        this.enter_ShowingWarning();
      },
      enter_ClearLocalStorage() {
        localStorage.clear();
        this.setState('Inactive');
        location.reload(true);
      },
      enter_ShowingWarning() {
        this.setState('ShowingWarning');
      },
      enter_UserIsSettingOptions() {
        this.setState('UserIsSettingOptions');
      },
      async enter_CreatingLink() {
        this.setState('CreatingLink');
        const wheelConfig = this.$store.state.wheelConfig;
        try {
          this.$emit('start-wait-animation');
          const path = await ServerFunctions.createSharedWheel(this.editableWheel, wheelConfig);
          this.sharableLink = Locales.getAbsoluteUrl(
                                window.location.host, this.$i18n.locale, path);
          this.enter_ShowingLink();
        }
        catch (error) {
          alert(error);
        }
        finally {
          this.$emit('stop-wait-animation');
        }
      },
      enter_ShowingLink() {
        this.setState('ShowingLink');
      },
      enter_Inactive() {
        this.setState('Inactive');
      },
      copyLink() {
        const textBox = document.querySelector('#sharableLinkText');
        textBox.select();
        document.execCommand("copy");
        const message = this.$t('sharedialog.Link copied to the clipboard');
        this.$emit('show-snackbar-message', message);
      },
      setState(newState) {
        // console.log(`${this.fsm} => ${newState}`);
        this.fsm = newState;
      }
    }
    
  }
</script>
