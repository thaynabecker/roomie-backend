from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

class UserManager(BaseUserManager):
    """Manager for users."""
    
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        """Create, save and return a new user."""
        if not email:
            raise ValueError("Users must have an email address.")

        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, username=None, **extra_fields):
        """Create, save and return a new superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, username=username, **extra_fields)

class Republica(models.Model):
    nome_republica = models.CharField(max_length=100)
    descricao = models.TextField()
    codigo_acesso = models.CharField(max_length=20)
    data_criacao = models.DateField()

    def __str__(self):
        return self.nome_republica
    
    class Meta:
        verbose_name = "República"
        verbose_name_plural = "Repúblicas"
    
class Usuario(models.Model):
    username = models.CharField(max_length=255, unique=True, null=True, blank=True)
    nome = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True, null=True, blank=True)
    senha = models.CharField(max_length=100)
    data_nascimento = models.DateField()
    data_entrada = models.DateField()
    republica = models.ForeignKey(Republica, on_delete=models.PROTECT, related_name='usuarios')
    
    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]
    EMAIL_FIELD = "email"

    class Meta:
        """Meta options for the model."""
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"


    def __str__(self):
        return self.nome    

class Administrador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.PROTECT)

    def __str__(self):
        return f'Admin: {self.usuario.nome}'
    
    class Meta:
        verbose_name = "Administrador"
        verbose_name_plural = "Administradores"
    
class Departamento(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    republica = models.ForeignKey(Republica, on_delete=models.PROTECT, related_name='departamentos')
    usuarios = models.ManyToManyField(Usuario, related_name='departamentos')

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"
    
class Despesa(models.Model):
    descricao = models.TextField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    data_vencimento = models.DateField()
    republica = models.ForeignKey(Republica, on_delete=models.PROTECT, related_name='despesas')

    def __str__(self):
        return f'{self.descricao} - R${self.valor_total}'
    
class Pagamento(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('atrasado', 'Atrasado'),
    ]

    valor_pago = models.DecimalField(max_digits=10, decimal_places=2)
    data_pagamento = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    despesa = models.ForeignKey(Despesa, on_delete=models.PROTECT, related_name='pagamentos')
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='pagamentos')

    def __str__(self):
        return f'{self.usuario.nome} pagou R${self.valor_pago}'        
    
class Tarefa(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('em_andamento', 'Em andamento'),
        ('concluida', 'Concluída'),
    ]

    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    data_execucao = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    responsavel = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='tarefas')
    departamento = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name='tarefas')

    def __str__(self):
        return self.titulo    
    
class Advertencia(models.Model):
    TIPO_CHOICES = [
        ('leve', 'Leve'),
        ('moderada', 'Moderada'),
        ('grave', 'Grave'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='advertencias')
    motivo = models.TextField()
    data = models.DateField()
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)

    def __str__(self):
        return f'{self.tipo} - {self.usuario.nome}'    
    
    class Meta:
        verbose_name = "Advertência"
        verbose_name_plural = "Advertências"
    
class ChatMensagem(models.Model):
    mensagem = models.TextField()
    data_envio = models.DateTimeField()
    republica = models.ForeignKey(Republica, on_delete=models.PROTECT, related_name='mensagens')
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='mensagens')

    def __str__(self):
        return f'{self.usuario.nome}: {self.mensagem[:30]}...'    
    
    class Meta:
        verbose_name = "Mensagem de Chat"
        verbose_name_plural = "Mensagens de Chat"