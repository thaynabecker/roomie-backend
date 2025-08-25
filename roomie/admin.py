from django.contrib import admin
from .models import Republica, Usuario, Administrador, Departamento, Despesa, Pagamento, Tarefa, Advertencia, ChatMensagem

class MyAdminSite(admin.AdminSite):
    index_title = "Painel da República"

myadmin = MyAdminSite(name="admin")

myadmin.register(Republica)
myadmin.register(Usuario)
myadmin.register(Administrador)
myadmin.register(Departamento)
myadmin.register(Despesa)
myadmin.register(Pagamento)
myadmin.register(Tarefa)
myadmin.register(Advertencia)
myadmin.register(ChatMensagem)