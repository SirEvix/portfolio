<template>
  <main :class="['cursed-page', { 'admin-visible': adminPanelVisible }]">
    <section class="hero">
      <div :class="['hero-gif', { playing: heroGifVisible }]">
        <img v-if="heroGifVisible && heroGifSrc" :src="heroGifSrc" alt="hero gif" class="hero-image" @error="heroGifSrc = null" :style="{ objectPosition: heroImageObjectPosition }" />
        <div class="hero-text">
          <div class="hero-top">
            <div class="hero-top-left">{{ heroOverlay.topLeft }}</div>
            <div class="hero-top-right">{{ heroOverlay.topRight }}</div>
          </div>
          <div class="hero-bottom">
            <div class="hero-bottom-left">{{ heroOverlay.bottomLeft }}</div>
            <div class="hero-bottom-right">{{ heroOverlay.bottomRight }}</div>
          </div>
          <div v-if="heroOverlay.center" class="hero-center">{{ heroOverlay.center }}</div>
        </div>
      </div>
      <h1 class="hero-title">Cursed Relics</h1>
      <p class="hero-sub">Limited cursed collectibles.</p>
    </section>

    <section class="relics">
      <div class="relics-header">
        <h2 class="section-title">First drops</h2>
        <input class="goto-input" v-model="query" @input="onQueryInput" placeholder="#" />
      
      </div>

      <div ref="scrollArea" class="scroll-area">
        <div class="grid">
          <article
            v-for="relic in relics"
            :key="relic.id"
            class="card"
            :class="[relic.status ? relic.status.toLowerCase() : 'dormant', { focused: relic.id === focusedId } ]"
            :data-id="relic.id"
            ref="cards"
            @click="(relic && relic.status && String(relic.status).toLowerCase()) === 'void' ? null : onCardClick(relic)"
          >
            <div class="thumb">
              <div class="thumb-placeholder">IMG</div>
            </div>
            <div class="card-body">
              <div class="card-title">Cursed Finger</div>
              <div class="relic-meta">
                <span class="relic-num">#{{ relic.id }}</span>
                <span class="badge" :class="relic.status ? relic.status.toLowerCase() : 'dormant'">{{ relic.status || 'Dormant' }}</span>
              </div>
              <div class="owner-line" v-if="relic.owner_name">
                <small>{{ relic.owner_name }}</small>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    

    <div v-if="showFoundPopup" class="found-popup">
      <div class="found-card">
        <button class="close-x" @click="closeFoundPopup">✕</button>
        <h3 v-if="foundRelicId">You found the finger number {{ foundRelicId }}</h3>
        <h3 v-else-if="foundRelicStatus === 'invalid'">Unknown tag</h3>
        <h3 v-else-if="foundRelicStatus === 'error'">Verification error</h3>

        <p v-if="foundRelicId && foundRelicStatus !== 'claimed'">Write your name to claim this finger.</p>
        <p v-if="foundRelicId && foundRelicStatus === 'claimed'">Already claimed by: {{ foundOwnerName || 'unknown' }}</p>

        <div class="claim-controls" v-if="foundRelicId && foundRelicStatus !== 'claimed'">
          <input v-model="claimNameInput" placeholder="Your name (1-15 chars, letters+numbers only)" />
          <div class="controls">
            <button @click="claimFoundRelic" :disabled="!validateName(claimNameInput)">Claim</button>
            <button @click="closeFoundPopup">Cancel</button>
          </div>
        </div>

        <div class="claim-controls" v-if="foundRelicId && foundRelicStatus === 'claimed'" style="margin-top:10px;">
          <div style="font-size:13px;margin-bottom:6px;color:var(--muted)">Want to change your name?</div>
          <input v-model="renameNameInput" placeholder="New name (1-15 chars, letters+numbers only)" />
          <div class="controls">
            <button @click="renameOwner" :disabled="!validateName(renameNameInput)">Rename</button>
            <button @click="closeFoundPopup">Cancel</button>
          </div>
        </div>

        <div v-if="verifyError" style="margin-top:8px;color:#f88">{{ verifyError }}</div>
      </div>
    </div>

    <!-- Bottom admin panel (visible only when ?token=isadmin) -->
    <div v-if="adminPanelVisible" class="admin-panel" style="margin-top:18px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.03)">
      <h3 style="margin:0 0 8px;color:var(--accent-2)">Admin Panel</h3>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        <input placeholder="admin key" v-model="adminKeyInput" style="padding:6px;border-radius:6px;width:220px" />
        <button @click="enterAdminKey">Enter Admin</button>
        <div v-if="isAdmin" style="color:var(--success);font-weight:700;margin-left:6px">Admin mode</div>
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <input placeholder="verify id" v-model="adminVerifyId" style="padding:6px;border-radius:6px;width:72px" />
        <input placeholder="internal code" v-model="adminInternalCode" style="padding:6px;border-radius:6px;width:160px" />
        <button @click="adminVerifyInternal">Verify internal code</button>
        <div v-if="adminVerifyResult" style="color:var(--muted);font-size:13px;margin-left:8px">{{ adminVerifyResult }}</div>
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <input placeholder="target id" v-model="adminTargetId" style="padding:6px;border-radius:6px;width:96px" />
        <button @click="adminLoadTarget">Load</button>
        <div style="color:var(--muted);font-size:13px">Load local relic into form</div>
      </div>

      <div style="margin-bottom:10px">
        <div v-if="adminError" style="color:#f88;font-size:13px">{{ friendlyError(adminError) || adminError }}</div>
        <div v-if="adminSuccess" style="color:var(--success);font-size:13px">{{ adminSuccess }}</div>
      </div>

      <div style="display:flex;gap:8px;flex-direction:column;max-width:640px">
        <label style="font-size:13px;color:var(--muted)">Status</label>
        <select v-model="adminEditStatus" style="width:160px;padding:6px;border-radius:6px">
          <option value="Dormant">Dormant</option>
          <option value="claimed">claimed</option>
          <option value="sent">sent</option>
          <option value="reserved">reserved</option>
          <option value="disputed">disputed</option>
          <option value="void">void</option>
        </select>
        <label style="font-size:13px;color:var(--muted)">Owner name</label>
        <input v-model="adminEditOwnerName" placeholder="owner name (empty to clear)" />
        <label style="font-size:13px;color:var(--muted)">Owner date (ISO)</label>
        <input v-model="adminEditOwnerDate" placeholder="owner_date (ISO)" />
        <div style="display:flex;justify-content:flex-end;margin-top:8px;gap:8px">
          <button @click="adminUpdateRelic({ id: parseInt(adminTargetId,10), status: adminEditStatus, owner_name: adminEditOwnerName || null, owner_date: adminEditOwnerDate || null })">Save Admin Changes</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import cursedFingerGif from '@/assets/images/cursed_finger.gif'
import cursedFinger2Gif from '@/assets/images/cursed_finger_2.gif'
import sleepingImg from '@/assets/images/sleeping_character.jpg'

export default {
  name: 'CursedRelics',
  data() {
    return {
      relics: [],
      query: '',
      focusedId: null,
      // token flow
      foundToken: null,
      foundRelicId: null,
      foundRelicStatus: null,
      foundOwnerName: null,
      // hero gif controls
      heroGifVisible: false,
      heroGifSrc: null,
      heroImageObjectPosition: '50% 26%',
      heroOverlay: {
        topLeft: 'Awaiting NFC scan — tap your tag',
        topRight: '',
        bottomLeft: '',
        bottomRight: ''
      , center: ''
      },
      renameNameInput: '',
      claimNameInput: '',
      showFoundPopup: false,
      verifyError: null,
      // admin mode
      isAdmin: false,
      adminKeyInput: '',
      adminKey: '',
      adminVerifyId: '',
      adminInternalCode: '',
      adminVerifyResult: null,
      // admin panel visibility (activated via ?token=isadmin)
      adminPanelVisible: false,
      // admin edit target id when using the bottom admin panel
      adminTargetId: '',
      // admin edit form
      adminEditStatus: '',
      adminEditOwnerName: '',
      adminEditOwnerDate: '',
      // admin UI messages
      adminError: null,
      adminSuccess: null,
    }
  },
  mounted() {
    // Prefer authoritative server state: try /api/relics, then fallback to bundled assets, then generated mock
    fetch('/api/relics').then(r => r.json()).then(data => { this.relics = data }).catch(() => {
      return fetch('/assets/relics.json').then(r => r.json()).then(data => { this.relics = data }).catch(()=>{ this.relics = Array.from({ length: 500 }, (_, i) => ({ id: i+1, status: 'Dormant' })) })
    }).finally(() => {
      // auto-verify token in URL
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token === 'isadmin') {
          // reveal admin panel only (do not treat as relic token)
          this.adminPanelVisible = true;
          try {
            document.body.classList.add('admin-visible')
            try { document.documentElement.classList.add('admin-visible') } catch(e) { /* noop */ }
            try { const appEl = document.getElementById('app'); if (appEl) appEl.classList.add('admin-visible') } catch(e) { /* noop */ }
          } catch(e) { /* noop */ }
        } else if (token) {
          this.foundToken = token;
          // show initial hero gif when token present
          this.heroGifVisible = true;
          this.heroGifSrc = cursedFingerGif;
          this.heroOverlay.topLeft = 'You found the finger';
          this.heroOverlay.center = '';
          this.verifyToken(token);
        } else {
          // default hero image when no token: sleeping character + shimmer
          this.heroGifVisible = true;
          this.heroGifSrc = sleepingImg;
          this.heroOverlay.topLeft = '';
          this.heroOverlay.center = 'Awaiting NFC scan tap your tag';
          this.heroOverlay.topRight = '';
          this.heroOverlay.bottomLeft = '';
          this.heroOverlay.bottomRight = '';
        }
      } catch(e){ console.warn('token parse error', e) }
    })
  },
  watch: {
    adminPanelVisible(val) {
      try {
        if (val) document.body.classList.add('admin-visible')
        else document.body.classList.remove('admin-visible')
      } catch (e) { /* noop when DOM not available */ }
    }
  },
  beforeUnmount() {
    try {
      document.body.classList.remove('admin-visible')
      try { document.documentElement.classList.remove('admin-visible') } catch(e) { /* noop */ }
      try { const appEl = document.getElementById('app'); if (appEl) appEl.classList.remove('admin-visible') } catch(e) { /* noop */ }
    } catch(e) { /* noop */ }
  },
  methods: {
    apiBase() { return '' }, // same-origin API (dev proxy should forward to server)
    async verifyToken(token) {
      this.verifyError = null
      try {
        const url = `/api/relic/verify?token=${encodeURIComponent(token)}`;
        const res = await fetch(url);
        const body = await res.json().catch(()=>({}));
        if (!res.ok || body.error) {
          if (body && body.error) this.verifyError = body.error
          this.showFoundPopup = true
          this.foundRelicId = null
          this.foundRelicStatus = body.error === 'invalid_token' ? 'invalid' : 'error'
          return
        }
        // support both { id, status, owner_name } and { relic_id, status }
        this.foundRelicId = body.id || body.relic_id || null
        this.foundRelicStatus = body.status || null
        this.foundOwnerName = body.owner_name || body.owner || null
        this.claimNameInput = ''
        this.showFoundPopup = true
        this.focusedId = this.foundRelicId
        // ensure hero is visible for verified token
        this.heroGifVisible = true
        this.heroGifSrc = cursedFingerGif
        if (this.foundRelicId) {
          this.heroOverlay.topLeft = `You found the finger number ${this.foundRelicId}`
          this.heroOverlay.topRight = this.foundOwnerName || ''
          // populate admin edit form when popup opens
          this.adminEditStatus = this.foundRelicStatus || ''
          this.adminEditOwnerName = this.foundOwnerName || ''
          this.adminEditOwnerDate = ''
        }
        this.$nextTick(() => this.scrollToRelic(this.foundRelicId))
      } catch (err) {
        this.verifyError = 'network_error'
        this.showFoundPopup = true
        this.foundRelicStatus = 'error'
      }
    },
    async enterAdminKey() {
      const key = (this.adminKeyInput || '').trim();
      if (!key) return this.isAdmin = false;
      try {
        // quick test call to confirm key works
        const res = await fetch('/api/admin/relics/sample', { headers: { 'x-admin-key': key } });
        if (!res.ok) { this.isAdmin = false; this.adminKey = ''; throw new Error('invalid_admin_key') }
        this.adminKey = key;
        this.isAdmin = true;
        this.adminKeyInput = '';
      } catch (e) {
        this.isAdmin = false;
        this.adminKey = '';
        this.adminVerifyResult = 'invalid_key';
      }
    },
    async adminVerifyInternal() {
      if (!this.isAdmin || !this.adminKey) return this.adminVerifyResult = 'not_admin';
      const id = parseInt(this.adminVerifyId, 10);
      if (!id) return this.adminVerifyResult = 'invalid_id';
      try {
        const res = await fetch('/api/admin/relic/verify-internal', { method: 'POST', headers: { 'Content-Type':'application/json', 'x-admin-key': this.adminKey }, body: JSON.stringify({ id, internal_code: this.adminInternalCode }) });
        const body = await res.json().catch(()=>({}));
        if (!res.ok) return this.adminVerifyResult = body.error || 'verify_failed';
        this.adminVerifyResult = body.match ? 'match' : 'no_match';
      } catch (e) { this.adminVerifyResult = 'network_error' }
    },
    adminLoadTarget() {
      this.adminError = null;
      this.adminSuccess = null;
      const id = parseInt(this.adminTargetId, 10);
      if (!id) { this.adminError = 'invalid_id'; return }
      const r = this.relics.find(x => x.id === id);
      if (!r) {
        this.adminEditStatus = '';
        this.adminEditOwnerName = '';
        this.adminEditOwnerDate = '';
        this.adminError = 'not_found_local';
        return
      }
      this.adminEditStatus = r.status || '';
      this.adminEditOwnerName = r.owner_name || '';
      this.adminEditOwnerDate = r.owner_date || '';
      this.adminSuccess = `Loaded id ${id}`;
    },
    async adminUpdateRelic(payload) {
      // clear prior messages
      this.adminError = null;
      this.adminSuccess = null;
      if (!this.isAdmin || !this.adminKey) { this.adminError = 'not_admin'; return }
      const id = payload && Number.isInteger(payload.id) ? payload.id : null
      if (!id || id < 1) { this.adminError = 'missing_id'; return }
      // build a clean body only with allowed fields
      const bodyPayload = { id };
      if (typeof payload.status === 'string' && payload.status.length) bodyPayload.status = payload.status;
      if (typeof payload.owner_name === 'string') bodyPayload.owner_name = payload.owner_name || null;
      if (typeof payload.owner_date === 'string') bodyPayload.owner_date = payload.owner_date || null;
      try {
        const res = await fetch('/api/admin/relic/update', { method: 'POST', headers: { 'Content-Type':'application/json', 'x-admin-key': this.adminKey }, body: JSON.stringify(bodyPayload) });
        const body = await res.json().catch(()=>({}));
        if (!res.ok || body.error) {
          console.warn('admin update failed', body.error || body);
          this.adminError = body.error || 'update_failed';
          return
        }
        const relic = body.relic;
        const idx = this.relics.findIndex(r=>r.id === relic.id)
        if (idx !== -1) {
          const updated = Object.assign({}, this.relics[idx], { status: relic.status, owner_name: relic.owner_name, owner_date: relic.owner_date });
          this.relics.splice(idx, 1, updated);
        }
        // update hero overlay if this relic is focused
        if (this.focusedId === relic.id) {
          this.heroOverlay.topRight = relic.owner_name || '';
          this.heroOverlay.bottomRight = relic.owner_date ? this.formatDate(relic.owner_date) : '';
          this.heroOverlay.topLeft = relic.status && relic.status.toLowerCase() === 'claimed' ? 'Finger claimed by' : relic.status || '';
          // show claiming animation if newly claimed
          if (relic.status && relic.status.toLowerCase() === 'claimed') this.heroGifSrc = cursedFingerGif;
        }
        this.adminSuccess = 'update_successful';
        console.log('admin update succeeded', relic);
        this.showFoundPopup = false;
      } catch (e) {
        console.error('admin update error', e);
        this.adminError = 'network_error'
      }
    },
    onCardClick(relic) {
      this.focusedId = relic.id
      this.$nextTick(() => this.scrollToRelic(relic.id))
      // if admin, open the found popup to allow editing
      if (this.isAdmin) {
        this.showFoundPopup = true
        this.foundRelicId = relic.id
        this.foundRelicStatus = relic.status || 'Dormant'
        this.foundOwnerName = relic.owner_name || ''
        this.adminEditStatus = relic.status || ''
        this.adminEditOwnerName = relic.owner_name || ''
        this.adminEditOwnerDate = relic.owner_date || ''
      }
      // normalize status for reliable comparisons
      const statusNorm = relic && relic.status ? String(relic.status).trim().toLowerCase() : ''
      // treat these statuses the same as dormant (use sleeping image + center text)
      const dormantLike = ['', 'dormant', 'sent', 'reserved', 'disputed']
      if (!relic || dormantLike.includes(statusNorm)) {
        // dormant: show sleeping image + message
        this.heroGifVisible = true
        this.heroGifSrc = sleepingImg
        this.heroOverlay.topLeft = ''
        this.heroOverlay.center = `This finger hasn't been awakened yet Tap your NFC tag to claim it!`
        this.heroOverlay.topRight = ''
        this.heroOverlay.bottomLeft = ''
        this.heroOverlay.bottomRight = ''
        return
      }
      // claimed or other active: show second hero gif with claim overlay
      if (statusNorm === 'claimed') {
        this.heroGifVisible = true
        this.heroGifSrc = cursedFinger2Gif
        this.heroOverlay.topLeft = 'Finger claimed by'
        this.heroOverlay.topRight = relic.owner_name || ''
        this.heroOverlay.bottomLeft = 'Claimed date'
        this.heroOverlay.bottomRight = relic.owner_date ? this.formatDate(relic.owner_date) : ''
        this.heroOverlay.center = ''
      } else {
        // other statuses (void, or unknown) show a neutral active overlay
        this.heroGifVisible = true
        this.heroGifSrc = cursedFingerGif
        this.heroOverlay.topLeft = relic.status || ''
        this.heroOverlay.topRight = relic.owner_name || ''
        this.heroOverlay.bottomLeft = relic.owner_date ? 'Claimed date' : ''
        this.heroOverlay.bottomRight = relic.owner_date ? this.formatDate(relic.owner_date) : ''
        this.heroOverlay.center = ''
      }
    },
    formatDate(iso) {
      try { return new Date(iso).toLocaleString() } catch(e){ return iso }
    },
    async claimFoundRelic() {
      if (!this.foundToken) return
      const name = (this.claimNameInput || '').trim();
      if (!name) return
      // client-side validation
      if (!/^[A-Za-z0-9]{1,15}$/.test(name)) { this.verifyError = 'invalid_name'; return }
      try {
        const res = await fetch('/api/relic/claim', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ token: this.foundToken, name }) })
        const body = await res.json().catch(()=>({}));
        if (!res.ok || body.error) {
          if (body && body.error === 'invalid_name') { this.verifyError = 'invalid_name'; return }
          // server-side conflict (already claimed) — update UI and close popup
          if (body && body.error === 'already_claimed') {
            this.foundRelicStatus = 'claimed'
            this.foundOwnerName = body.owner_name || name
            // update local relic if present
            const idx2 = this.relics.findIndex(r=>r.id === body.id || r.id === body.relic_id)
            if (idx2 !== -1) {
              // Vue 3: use splice to replace array element or mutate existing object
              const updated = Object.assign({}, this.relics[idx2], { status: 'claimed', owner_name: this.foundOwnerName });
              this.relics.splice(idx2, 1, updated);
            }
            // update hero overlay so username appears immediately
            this.heroOverlay.topRight = this.foundOwnerName
            this.heroOverlay.center = ''
            // show the claiming animation (cursed_finger.gif) when a claim happens
            this.heroGifSrc = cursedFingerGif
            this.showFoundPopup = false
            return
          }
          this.verifyError = body.error || 'claim_failed'
          return
        }
        const relic = body.relic || { id: body.id || body.relic_id, status: body.status, owner_name: body.owner_name }
        if (relic && relic.id) {
          const idx = this.relics.findIndex(r=>r.id === relic.id)
          if (idx !== -1) {
            const updated = Object.assign({}, this.relics[idx], { status: relic.status, owner_name: relic.owner_name, owner_date: relic.owner_date });
            this.relics.splice(idx, 1, updated);
          }
          this.foundRelicStatus = relic.status
          this.foundOwnerName = relic.owner_name
          // reflect claim in hero overlay immediately
          this.heroOverlay.topRight = this.foundOwnerName || ''
          this.heroOverlay.center = ''
          // show claiming animation (not the card-click GIF)
          if (relic.status && relic.status.toLowerCase() === 'claimed') this.heroGifSrc = cursedFingerGif
        }
        this.showFoundPopup = false
      } catch(e) {
        console.error('claim error', e)
        this.verifyError = 'network_error'
      }
    },
    async renameOwner() {
      if (!this.foundToken) return
      const name = (this.renameNameInput || '').trim();
      if (!name) return
      // client-side validation
      if (!/^[A-Za-z0-9]{1,15}$/.test(name)) { this.verifyError = 'invalid_name'; return }
      try {
        const res = await fetch('/api/relic/rename', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ token: this.foundToken, name }) })
        const body = await res.json().catch(()=>({}));
        if (!res.ok || body.error) {
          if (body && body.error === 'invalid_name') { this.verifyError = 'invalid_name'; return }
          this.verifyError = body.error || 'rename_failed'
          return
        }
        const relic = body.relic || { id: body.id || body.relic_id, status: body.status, owner_name: body.owner_name }
        if (relic && relic.id) {
          const idx = this.relics.findIndex(r=>r.id === relic.id)
          if (idx !== -1) {
            const updated = Object.assign({}, this.relics[idx], { status: relic.status, owner_name: relic.owner_name, owner_date: relic.owner_date });
            this.relics.splice(idx, 1, updated);
          }
          this.foundRelicStatus = relic.status
          this.foundOwnerName = relic.owner_name
          // update hero overlay immediately after rename
          this.heroOverlay.topRight = this.foundOwnerName || ''
          this.heroOverlay.center = ''
        }
        this.showFoundPopup = false
      } catch(e) {
        console.error('rename error', e)
        this.verifyError = 'network_error'
      }
    },
    validateName(name) {
      return typeof name === 'string' && /^[A-Za-z0-9]{1,15}$/.test(name)
    },
    friendlyError(code) {
      if (!code) return null
      if (code === 'invalid_name') return 'Name must be 1–15 letters or numbers, no spaces or symbols.'
      if (code === 'network_error') return 'Network error — please try again.'
      return String(code)
    },
    closeFoundPopup() {
      this.showFoundPopup = false
      this.claimNameInput = ''
      this.foundToken = null
      this.foundRelicId = null
      this.foundRelicStatus = null
      this.foundOwnerName = null
      this.verifyError = null
      try { const url = new URL(window.location); url.searchParams.delete('token'); window.history.replaceState({}, '', url); } catch(e){ console.warn('clean url failed', e) }
    },
    onQueryInput() {
      const raw = (this.query || '').replace(/\D/g, '')
      this.query = raw
      if (!raw) { this.focusedId = null; return }
      let n = parseInt(raw, 10)
      if (Number.isNaN(n)) { this.focusedId = null; return }
      if (n < 1) n = 1
      if (n > this.relics.length) n = this.relics.length
      this.focusedId = n
      this.$nextTick(() => this.scrollToRelic(n))
    },
    scrollToRelic(id) {
      if (!id) return
      const cards = this.$refs.cards || []
      const el = Array.isArray(cards) ? cards.find(c => c && c.dataset && parseInt(c.dataset.id, 10) === id) : cards
      if (!el) return
      const container = this.$refs.scrollArea
      if (!container) return el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const offset = (elRect.top + elRect.bottom) / 2 - (containerRect.top + containerRect.bottom) / 2
      container.scrollBy({ top: offset, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
/* Keep the relics grid scrollable within a fixed region, but allow the
   whole page to scroll when the admin panel is visible (admin-visible). */
.cursed-page {
  display: block;
  min-height: 100vh;
  overflow: visible;
}

.cursed-page.admin-visible {
  /* when admin panel is shown, let the page itself scroll so bottom
     admin controls are reachable on small screens */
  overflow-y: auto;
}
.admin-panel {
  box-sizing: border-box;
  width: 100%;
}
</style>

<style scoped lang="scss">
// Mobile-first dark theme inspired by Jujutsu Kaisen (deep purples, neon accents)
:root {
  --bg: #0b0710;
  --card: #0f0b14;
  --muted: #9a86a6;
  --accent: #9d6fff; // purple
  --accent-2: #b48cff;
  --success: #28c76f;
  --danger: #ff5c7c;
}
.cursed-page {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(11,7,16,1) 0%, rgba(18,10,28,1) 100%);
  color: #eee;
  padding: 18px 14px;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

/* prevent horizontal scroll when cards scale or glow */
.cursed-page, .scroll-area { overflow-x: hidden; }

.hero {
  text-align: center;
  margin-bottom: 14px;
}
.hero-gif {
  position: relative;
  width: 100%;
  height: 180px;
  background: linear-gradient(90deg, rgba(123,60,255,0.12), rgba(180,140,255,0.06));
  border: 1px solid rgba(123,60,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-weight: 600;
  border-radius: 12px;
  margin-bottom: 12px;
}
.hero-gif::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  pointer-events: none;
  background: linear-gradient(120deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%);
  transform: translateX(-100%);
  animation: shimmer 2.5s infinite;
  z-index: 1;
}
.hero-gif.playing::after { /* keep shimmer visible for images/gifs */ display: block; }

.hero-image { position: absolute; left:0; top:0; width:100%; height:100%; object-fit:cover; z-index:0; border-radius:12px; object-position: 50% 10%; }
.hero-text { position: relative; z-index:3; width:100%; padding: 10px 14px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; height:100% }
.hero-top, .hero-bottom { display:flex; justify-content:space-between; align-items:center }
.hero-top-left, .hero-top-right, .hero-bottom-left, .hero-bottom-right { color: #fff; font-weight:700 }
.hero-top-left { font-size:16px; color: var(--accent-2) }
.hero-top-right { font-size:14px }
.hero-bottom-left, .hero-bottom-right { font-size:12px; color:var(--muted) }
.hero-center { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); background: rgba(0,0,0,0.2); padding:10px 14px; border-radius:10px; z-index:4; color:#fff; font-weight:700; text-align:center; max-width:80%; }

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.hero-title {
  font-size: 20px;
  margin: 6px 0 4px;
  color: var(--accent-2);
}
.hero-sub {
  color: var(--muted);
  font-size: 13px;
  margin: 0;
}

.section-title {
  margin: 8px 0;
  font-size: 16px;
  color: var(--accent-2);
}

.relics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.goto-input {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(180,140,255,0.06);
  color: #fff;
  padding: 8px 10px;
  border-radius: 8px;
  width: 96px;
  text-align: center;
  font-weight: 700;
}

.scroll-area {
  /* Show approximately 5 cards tall. Calculated as:
     5 * card-approx-height (84px) + 4 * grid-gap (10px) = 460px */
  height: 460px;
  max-height: 460px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 6px; /* allow space for scroll bar */
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* mobile-first: 2 columns */
  gap: 10px;
}

.card {
  background: linear-gradient(180deg, rgba(20,12,26,0.6), rgba(15,10,20,0.6));
  border: 1px solid rgba(123,60,255,0.12);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: box-shadow 220ms ease, transform 160ms ease;
  box-sizing: border-box;
  max-width: 100%;
  min-height: 84px;
}

.thumb {
  width: 40%;
  margin-right: 8px;
}
.thumb-placeholder {
  width: 100%;
  height: 64px;
  background: linear-gradient(90deg, #1a1020, #2a1335);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-weight: 700;
}

.card-body {
  width: 60%;
}
.owner-line small { display:block; color: var(--muted); font-size: 12px; margin-top:6px; }
.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.relic-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.relic-num {
  color: var(--muted);
  font-size: 13px;
}
.badge {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #0b0710;
}

/* status glow on cards */
.card.dormant { box-shadow: none; }
.card.reserved { box-shadow: 0 6px 18px rgba(123,60,255,0.20), 0 0 8px rgba(123,60,255,0.12) inset; }
.card.sent { box-shadow: 0 6px 18px rgba(246,201,14,0.22), 0 0 8px rgba(246,201,14,0.12) inset; }
.card.claimed { box-shadow: 0 6px 18px rgba(255,138,0,0.28), 0 0 10px rgba(255,138,0,0.18) inset; }
.card.disputed { box-shadow: 0 6px 14px rgba(255,140,0,0.12); }
.card.void { opacity: 0.6; pointer-events: none; cursor: default; }

/* focused (stronger) */
.card.focused {
  transform: translateY(-10px) scale(1.03);
  border: 1px solid rgba(123,60,255,0.95);
  z-index: 40;
  position: relative;
  animation: focusPulse 1.6s ease-in-out infinite;
}
.card.focused::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 12px;
  pointer-events: none;
  box-shadow: 0 20px 60px rgba(123,60,255,0.38), 0 0 40px rgba(123,60,255,0.24);
  opacity: 0.98;
}
.card.focused .badge { transform: scale(1.12); }

@keyframes focusPulse {
  0% {
    box-shadow: 0 18px 44px rgba(123,60,255,0.30);
  }
  50% {
    box-shadow: 0 30px 80px rgba(123,60,255,0.44);
  }
  100% {
    box-shadow: 0 18px 44px rgba(123,60,255,0.30);
  }
}

/* badge colors for the new statuses */
.badge.dormant { background: rgba(255,255,255,0.06); color: var(--muted); }
.badge.reserved { background: rgba(123,60,255,1); color: #fff; }
.badge.sent { background: #f6c90e; color: #120a00; }
.badge.claimed { background: #ff8a00; color: #120a00; }
.badge.disputed { background: #ff8c00; color: #120a00; }
.badge.void { background: #666; color: #fff; }

/* larger screens */
@media (min-width: 780px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
  .hero-gif { height: 240px; }
}

/* found popup */
.found-popup {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.6);
  z-index: 200;
}
.found-card {
  background: #0f0b14; padding: 18px; border-radius: 12px; width: 92%; max-width: 420px; color: #fff; position: relative;
}
.found-card h3 { margin: 0 0 8px 0; color: var(--accent-2); }
.claim-controls { margin-top: 12px; display:flex; flex-direction:column; gap:8px }
.claim-controls input { padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: #fff }
.controls { display:flex; gap:8px; justify-content:flex-end }
.controls button { padding: 8px 12px; border-radius:8px; border:none; cursor:pointer }
.close-x { position:absolute; right:8px; top:8px; background:transparent; border:none; color:var(--muted); font-size:16px }

</style>
