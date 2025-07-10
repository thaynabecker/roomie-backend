from django.contrib import admin
from .models import Republica, Usuario, Administrador, Departamento, Despesa, Pagamento, Tarefa, Advertencia, ChatMensagem

admin.site.register(Republica)
admin.site.register(Usuario)
admin.site.register(Administrador)
admin.site.register(Departamento)
admin.site.register(Despesa)
admin.site.register(Pagamento)
admin.site.register(Tarefa)
admin.site.register(Advertencia)
admin.site.register(ChatMensagem)