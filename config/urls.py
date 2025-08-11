from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from roomie.views import RepublicaViewSet, UsuarioViewSet, AdministradorViewSet, DepartamentoViewSet, DespesaViewSet, PagamentoViewSet, TarefaViewSet, AdvertenciaViewSet, ChatMensagemViewSet

admin.site.site_header = "Roomie Administração"
admin.site.site_title = "Roomie Admin"
admin.site.index_title = "Painel da República"

router = DefaultRouter()
router.register(r'republicas', RepublicaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'administradores', AdministradorViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'despesas', DespesaViewSet)
router.register(r'pagamentos', PagamentoViewSet)
router.register(r'tarefas', TarefaViewSet)
router.register(r'advertencias', AdvertenciaViewSet)
router.register(r'chatmensagens', ChatMensagemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
]