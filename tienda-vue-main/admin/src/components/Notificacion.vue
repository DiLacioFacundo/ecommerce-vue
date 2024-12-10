<template>
  <div v-if="visible" class="notification" :class="`notification-${type}`">
    <div class="icon">
      <i :class="notificationIcon"></i>
    </div>
    <div class="content">
      <span class="message">{{ message }}</span>
    </div>
    <button class="close-btn" @click="closeNotification">&times;</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "info", // Puede ser "success", "error", "warning", "info"
    },
    duration: {
      type: Number,
      default: 3000, // Tiempo en milisegundos antes de que desaparezca
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    notificationIcon() {
      switch (this.type) {
        case "success":
          return "fas fa-check-circle";
        case "error":
          return "fas fa-times-circle";
        case "warning":
          return "fas fa-exclamation-triangle";
        case "info":
        default:
          return "fas fa-info-circle";
      }
    },
  },
  methods: {
    closeNotification() {
      this.visible = false;
    },
  },
  mounted() {
    if (this.duration > 0) {
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    }
  },
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1051;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  animation: fadeIn 0.3s ease;
  color: #fff;
}

.notification-success {
  background-color: #28a745;
}

.notification-error {
  background-color: #dc3545;
}

.notification-warning {
  background-color: #ffc107;
  color: #212529;
}

.notification-info {
  background-color: #17a2b8;
}

.icon {
  font-size: 24px;
}

.message {
  flex-grow: 1;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: inherit;
  cursor: pointer;
}

.close-btn:hover {
  opacity: 0.8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
